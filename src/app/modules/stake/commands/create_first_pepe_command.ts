/* eslint-disable class-methods-use-this */
import { LENGTH_INDEX, NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { cryptography, Modules, StateMachine } from 'klayr-sdk';
import { createWorkerSchema } from '../schemas';
import { WorkerStore } from '../stores/workerStore';
import { isValidWorkerType } from '../../../plugins/drip/helpers';
import { StakeMethod } from '../method';
import { workerData } from '../../../nftTypes';
import { WorkerAttributes } from '../types';
import { WorkerStakedStore } from '../stores/workerStakedStore';

interface Params {
	recipient: Buffer;
	type: string;
}

const ownChainID = Buffer.from('01371337', 'hex');

export class CreateFirstPepeCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = createWorkerSchema;

	public addDependencies(args: { method: StakeMethod; nftMethod: NFTMethod }) {
		this._method = args.method;
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { recipient, type } = context.params;

		if (!isValidWorkerType(type as string)) {
			return {
				status: StateMachine.VerifyStatus.FAIL,
				error: new Error('Invalid type'),
			};
		}

		const combinedKey = Buffer.concat([recipient, Buffer.from(type)]);
		const workerStore = this.stores.get(WorkerStore);

		const hasWorker = await workerStore.has(context, combinedKey);
		if (hasWorker) {
			return {
				status: StateMachine.VerifyStatus.FAIL,
				error: new Error('Recipient already minted this type of worker'),
			};
		}

		const hasEnoughBalance = await this._method.checkForBalanceWorker(context, recipient, type);
		if (!hasEnoughBalance) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Insufficient funds') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { recipient, type } = context.params;

		const data = workerData[type];
		const attributesArray = this._method.createWorkerAttributes(data);
		const attributes: WorkerAttributes = data.attributes;

		const index = await this._nftMethod.getNextAvailableIndex(context, data.collectionID);
		const indexBytes = Buffer.alloc(LENGTH_INDEX);
		indexBytes.writeBigInt64BE(index);
		const nftID = Buffer.concat([ownChainID, data.collectionID, indexBytes]);

		try {
			await this._method.burnWorkerFee(context, recipient, attributes);
			await this._nftMethod.create(
				context.getMethodContext(),
				recipient,
				data.collectionID,
				attributesArray,
			);

			const combinedKey = Buffer.concat([recipient, Buffer.from(type)]);
			const workerStore = this.stores.get(WorkerStore);
			await workerStore.set(context, combinedKey, { minted: true });

			const address = cryptography.address.getKlayr32AddressFromAddress(recipient);
			const workerStakedStore = this.stores.get(WorkerStakedStore);
			await workerStakedStore.set(context, Buffer.from(address), { nftID, experience: BigInt(0) });
		} catch (e) {
			console.log('error creating worker:', e);
			throw e;
		}

		try {
			await this._nftMethod.lock(context, this.name, nftID);
			console.log('Pepe created and locked:', nftID.toString('hex'));
		} catch (e) {
			console.log('error creating worker:', e);
			throw e;
		}
	}
}
