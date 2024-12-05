/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { createBusinessSchema } from '../schemas';
import { LENGTH_INDEX, NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { BusinessStore } from '../stores/businessStore';
import { StakeTimeStore } from '../stores/stakeTime';
import { BusinessAttributes } from '../types';
import { StakeMethod } from '../method';
import { isValidBusinessType } from '../../../plugins/drip/helpers';
import { businessData, BusinessType } from '../../../nftTypes';

interface Params {
	recipient: Buffer;
	type: string;
}

const ownChainID = Buffer.from('01371337', 'hex');

export class CreateFirstBusinessCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = createBusinessSchema;

	public addDependencies(args: { method: StakeMethod; nftMethod: NFTMethod }) {
		this._method = args.method;
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { recipient, type } = context.params;

		if (!isValidBusinessType(type as string)) {
			return {
				status: StateMachine.VerifyStatus.FAIL,
				error: new Error('Invalid type'),
			};
		}

		const combinedKey = Buffer.concat([recipient, Buffer.from(type)]);
		const businessStore = this.stores.get(BusinessStore);

		const hasBusiness = await businessStore.has(context, combinedKey);
		if (hasBusiness) {
			return {
				status: StateMachine.VerifyStatus.FAIL,
				error: new Error('Recipient already minted this type of business'),
			};
		}

		if (type === BusinessType.LemonadeStand) {
			return { status: StateMachine.VerifyStatus.OK };
		}

		const hasEnoughBalance = await this._method.checkForBalanceBusiness(context, recipient, type);
		if (!hasEnoughBalance) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Insufficient funds') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { recipient, type } = context.params;

		const data = businessData[type];
		const attributesArray = this._method.createBusinessAttributes(data);
		const attributes: BusinessAttributes = data.attributes;

		const index = await this._nftMethod.getNextAvailableIndex(context, data.collectionID);
		const indexBytes = Buffer.alloc(LENGTH_INDEX);
		indexBytes.writeBigInt64BE(index);
		const nftID = Buffer.concat([ownChainID, data.collectionID, indexBytes]);

		try {
			if (type !== BusinessType.LemonadeStand) {
				await this._method.burnBusinessFee(context, recipient, attributes);
			}
			await this._nftMethod.create(
				context.getMethodContext(),
				recipient,
				data.collectionID,
				attributesArray,
			);
			const combinedKey = Buffer.concat([recipient, Buffer.from(type)]);
			const businessStore = this.stores.get(BusinessStore);
			await businessStore.set(context, combinedKey, { minted: true });
		} catch (e) {
			console.log('error:', e);
			throw new Error('Error creating business' + e);
		}

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		try {
			await this._nftMethod.lock(context, this.name, nftID);
		} catch (e) {
			console.log('error:', e);
			throw new Error('Error creating business' + e);
		}

		console.log('Pepe business created and locked:', nftID.toString('hex'));
	}
}
