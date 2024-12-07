/* eslint-disable class-methods-use-this */
import { cryptography, Modules, StateMachine } from 'klayr-sdk';
import { stakeWorkerSchema } from '../schemas';
import { StakeMethod } from '../method';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { WorkerStakedStore } from '../stores/workerStakedStore';
import { WorkerAttributes } from '../types';

interface Params {
	nftID: Buffer;
}

export class StakeWorkerCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = stakeWorkerSchema;

	public addDependencies(args: { method: StakeMethod; nftMethod: NFTMethod }) {
		this._method = args.method;
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { nftID } = context.params;
		console.log(this._method);

		const nft = await this._nftMethod.getNFT(context, nftID);
		if (!nft) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT not found') };
		}

		//TODO: Owner check?

		const locked = this._nftMethod.isNFTLocked(nft);
		if (locked) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('NFT is already staked') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	// TODO : double staking code here with create first pepe
	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		const nft = await this._nftMethod.getNFT(context, nftID);
		const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		const address = Buffer.from(cryptography.address.getKlayr32AddressFromAddress(nft.owner));
		const workerStakedStore = this.stores.get(WorkerStakedStore);

		// delete staked worker if it exists
		const hasWorkerStaked = await workerStakedStore.has(context, address);
		if (!hasWorkerStaked) {
			const stakedWorker = await workerStakedStore.get(context, address);
			await this._nftMethod.unlock(context, this.name, stakedWorker.nftID);
			await workerStakedStore.del(context, address);
		}

		// stake worker
		await workerStakedStore.set(context, Buffer.from(address), {
			nftID,
			experience: BigInt(0),
			revMultiplier: attributes.revMultiplier.toString(),
			capMultiplier: attributes.capMultiplier.toString(),
		});

		await this._nftMethod.lock(context, this.name, nftID);
	}
}
