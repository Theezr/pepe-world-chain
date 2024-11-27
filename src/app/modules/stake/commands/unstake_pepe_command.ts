/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { unstakePepeSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { StakeMethod } from '../method';
import { StakeTimeStore } from '../stores/stakeTime';

interface Params {
	nftID: Buffer;
}

const lockingModule = 'stakePepe';

export class UnstakePepeCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = unstakePepeSchema;

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

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		const currentTime = context.header.timestamp;

		try {
			const nft = await this._nftMethod.getNFT(context, nftID);
			await this._nftMethod.unlock(context, lockingModule, nftID);
			await this._method.mintRewardsToUser(context, nftID, currentTime, nft.owner);
		} catch (e) {
			console.log('error:', e);
		}

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: 0 });

		console.log('UnstakePepeCommand executed');
	}
}
