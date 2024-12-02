/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { createFirstSchema } from '../schemas';
import { LENGTH_INDEX, NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { BusinessStore } from '../stores/businessStore';
import { StakeTimeStore } from '../stores/stakeTime';
import { NftType } from '../types';

interface Params {
	recipient: Buffer;
}
const ownChainID = Buffer.from('01371337', 'hex');
const collectionID = Buffer.from('00000001', 'hex');
const attributesArray = [
	{
		module: 'business',
		attributes: Buffer.from(
			JSON.stringify({
				name: 'Pepe Lemonade Stand',
				type: NftType.LemonadeStand,
				imageUrl: 'https://example.com/image.png',
				quantity: 1,
			}),
		),
	},
];

export class CreateFirstBusinessCommand extends Modules.BaseCommand {
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
		console.log('recipient verify:', recipient);

		const businessStore = this.stores.get(BusinessStore);
		try {
			const business = await businessStore.get(context, recipient);
			if (business) {
				return {
					status: StateMachine.VerifyStatus.FAIL,
					error: new Error('Recipient already minted business'),
				};
			}
		} catch {
			return { status: StateMachine.VerifyStatus.OK };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { recipient } = context.params;
		console.log('recipient execute:', recipient);

		const index = await this._nftMethod.getNextAvailableIndex(context, collectionID);
		const indexBytes = Buffer.alloc(LENGTH_INDEX);
		indexBytes.writeBigInt64BE(index);
		const nftID = Buffer.concat([ownChainID, collectionID, indexBytes]);

		console.log('nftID:', nftID.toString('hex'));

		try {
			await this._nftMethod.create(
				context.getMethodContext(),
				recipient,
				collectionID,
				attributesArray,
			);
			const businessStore = this.stores.get(BusinessStore);
			await businessStore.set(context, recipient, { minted: true });
		} catch (e) {
			console.log('error:', e);
		}

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		try {
			await this._nftMethod.lock(context, this.name, nftID);
		} catch (e) {
			console.log('error:', e);
		}

		console.log('Pepe business created and locked:', nftID.toString('hex'));
	}
}
