/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { claimRewardsSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { StakeMethod } from '../method';
import { StakeTimeStore } from '../stores/stakeTime';
import { WorkerStakedStore } from '../stores/workerStakedStore';

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

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		context.logger.info('EXECUTE claimRewards for NFT', nftID.toString());
		const currentTime = context.header.timestamp;

		const nft = await this._nftMethod.getNFT(context, nftID);
		const rewards = await this._method.mintRewardsToUser(context, nftID, currentTime, nft.owner);

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		const workerStakedStore = this.stores.get(WorkerStakedStore);
		const hasWorkerStaked = await workerStakedStore.has(context, nft.owner);
		if (hasWorkerStaked) {
			const workerStaked = await workerStakedStore.get(context, nft.owner);
			const newExperience = workerStaked.experience + rewards;
			await workerStakedStore.set(context, nft.owner, { nftID, experience: newExperience });
		}
	}
}
