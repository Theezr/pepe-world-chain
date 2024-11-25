/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { unstakePepeSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { StakeTimeStore } from '../stores/stakeTime';
import { StakeMethod } from '../method';

interface Params {
	nftID: Buffer;
}

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

		const nft = await this._nftMethod.getNFT(context, nftID);
		await this._method.mintRewardsToUser(context, nftID, currentTime, nft.owner);

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.del(context, nftID);
		console.log('time set to zero');

		console.log('module name:', this.name);

		await this._nftMethod.unlock(context, this.name, nftID);
		console.log('UnstakePepeCommand executed');
	}
}
