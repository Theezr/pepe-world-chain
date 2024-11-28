/* eslint-disable class-methods-use-this */
import { LENGTH_INDEX, NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules, StateMachine } from 'klayr-sdk';
import { createFirstSchema } from '../schemas';
import { WorkerStore } from '../stores/workerStore';

interface Params {
	recipient: Buffer;
}

const ownChainID = Buffer.from('01371337', 'hex');
const collectionID = Buffer.from('00000000', 'hex');
const attributesArray = [
	{
		module: 'worker',
		attributes: Buffer.from(
			JSON.stringify({
				name: 'Pepe Normie',
				level: 1,
				multiplier: 1,
			}),
		),
	},
];

export class CreateFirstPepeCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = createFirstSchema;

	public addDependencies(args: { nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { recipient } = context.params;

		const workerStore = this.stores.get(WorkerStore);
		try {
			const worker = await workerStore.get(context, recipient);
			if (worker) {
				return {
					status: StateMachine.VerifyStatus.FAIL,
					error: new Error('Recipient already minted worker'),
				};
			}
		} catch {
			return { status: StateMachine.VerifyStatus.OK };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { recipient } = context.params;

		try {
			const index = await this._nftMethod.getNextAvailableIndex(context, collectionID);
			const indexBytes = Buffer.alloc(LENGTH_INDEX);
			indexBytes.writeBigInt64BE(index);
			const nftID = Buffer.concat([ownChainID, collectionID, indexBytes]);

			try {
				await this._nftMethod.create(
					context.getMethodContext(),
					recipient,
					collectionID,
					attributesArray,
				);

				const workerStore = this.stores.get(WorkerStore);
				await workerStore.set(context, recipient, { minted: true });

				await this._nftMethod.lock(context, this.name, nftID);
			} catch (e) {
				console.log('error:', e);
			}

			console.log('Pepe created and locked:', nftID.toString('hex'));
		} catch (e) {
			console.log('error:', e);
		}
	}
}
