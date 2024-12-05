/* eslint-disable class-methods-use-this */
import { cryptography, Modules, StateMachine } from 'klayr-sdk';
import { claimRewardsSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { StakeMethod } from '../method';
import { StakeTimeStore } from '../stores/stakeTime';
import { WorkerStakedStore } from '../stores/workerStakedStore';
import { WorkerAttributes } from '../types';

interface Params {
	nftID: Buffer;
}

export class ClaimRewardsCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = claimRewardsSchema;

	public addDependencies(args: { method: StakeMethod; nftMethod: NFTMethod }) {
		this._method = args.method;
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { nftID } = context.params;

		const nft = await this._nftMethod.getNFT(context, nftID);
		if (!nft) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT not found') };
		}

		// if (nft.owner !== context.transaction.senderAddress) {
		// 	return {
		// 		status: StateMachine.VerifyStatus.FAIL,
		// 		error: new Error('NFT is not owned by sender'),
		// 	};
		// }

		const locked = this._nftMethod.isNFTLocked(nft);
		if (!locked) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT is not staked') };
		}
		const stakeTimeStore = this.stores.get(StakeTimeStore);
		const stakeTime = await stakeTimeStore.get(context, nftID);
		if (!stakeTime || stakeTime.time === 0) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('No stake time') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	// TODO: Clean up implementation (to methods)
	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		context.logger.info('EXECUTE claimRewards for NFT', nftID.toString());
		const currentTime = context.header.timestamp;

		const nft = await this._nftMethod.getNFT(context, nftID);
		// TODO: multiply by worker multipliers
		const rewards = await this._method.mintRewardsToUser(context, nftID, currentTime, nft.owner);

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		const workerStakedStore = this.stores.get(WorkerStakedStore);
		const address = Buffer.from(cryptography.address.getKlayr32AddressFromAddress(nft.owner));

		const hasWorkerStaked = await workerStakedStore.has(context, address);
		if (hasWorkerStaked) {
			const workerStaked = await workerStakedStore.get(context, address);
			const nft = await this._nftMethod.getNFT(context, workerStaked.nftID);

			const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
			const experienceNeeded = this._method.calculateExperienceToNextLevel(attributes);

			const newExperience = workerStaked.experience + rewards;
			const experience = newExperience >= experienceNeeded ? experienceNeeded : newExperience;
			console.log({ experience, newExperience, experienceNeeded });

			await workerStakedStore.set(context, address, { nftID, experience });
		}
	}
}
