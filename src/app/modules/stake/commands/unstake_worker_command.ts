/* eslint-disable class-methods-use-this */
import { cryptography, Modules, StateMachine } from 'klayr-sdk';
import { stakeWorkerSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { WorkerStakedStore } from '../stores/workerStakedStore';

interface Params {
	nftID: Buffer;
}

export class UnstakeWorkerCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = stakeWorkerSchema;

	public addDependencies(args: { nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
	}

	// TODO: Double staking code here
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
		if (!locked || !nft.lockingModule) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT is not staked') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;

		try {
			const nft = await this._nftMethod.getNFT(context, nftID);
			await this._nftMethod.unlock(context, nft.lockingModule!, nftID);

			const address = Buffer.from(cryptography.address.getKlayr32AddressFromAddress(nft.owner));
			const workerStakedStore = this.stores.get(WorkerStakedStore);
			await workerStakedStore.del(context, address);
		} catch (e) {
			console.log('error:', e);
		}
	}
}
