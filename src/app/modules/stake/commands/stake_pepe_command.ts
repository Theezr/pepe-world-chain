/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules, StateMachine } from 'klayr-sdk';
import { stakePepeSchema } from '../schemas';
import { StakeTimeStore } from '../stores/stakeTime';

interface Params {
	nftID: Buffer;
}

export class StakePepeCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = stakePepeSchema;

	public addDependencies(args: { nftMethod: NFTMethod }) {
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

		if (nft.owner !== context.transaction.senderAddress) {
			return {
				status: StateMachine.VerifyStatus.FAIL,
				error: new Error('NFT is not owned by sender'),
			};
		}

		const locked = this._nftMethod.isNFTLocked(nft);
		if (locked) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT is already staked') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		try {
			await this._nftMethod.lock(context, this.name, nftID);
		} catch (e) {
			console.log('error:', e);
		}
	}
}
