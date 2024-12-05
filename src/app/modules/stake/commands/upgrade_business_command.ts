/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { upgradeBusinessSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { TokenMethod } from 'klayr-framework/dist-node/modules/token';
import { StakeMethod } from '../method';
import { BusinessAttributes } from '../types';
import { StakeTimeStore } from '../stores/stakeTime';

interface Params {
	nftID: Buffer;
}

export class UpgradeBusinessCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = upgradeBusinessSchema;
	public chainTokenID = Buffer.from('0137133700000000', 'hex');

	public addDependencies(args: {
		method: StakeMethod;
		tokenMethod: TokenMethod;
		nftMethod: NFTMethod;
	}) {
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
		const attributes: BusinessAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		const hasEnoughBalance = await this._method.checkForBalanceBusiness(
			context,
			nft.owner,
			attributes.type,
		);
		if (!hasEnoughBalance) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Insufficient funds') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		const currentTime = context.header.timestamp;

		const nft = await this._nftMethod.getNFT(context, nftID);
		const attributes: BusinessAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		try {
			await this._method.mintRewardsToUser(context, nftID, currentTime, nft.owner);
			const stakeTimeStore = this.stores.get(StakeTimeStore);
			await stakeTimeStore.set(context, nftID, { time: currentTime });

			await this._method.burnBusinessFee(context, nft.owner, attributes);
		} catch (error) {
			console.log('Error burning fee:', error);
			throw new Error('Error burning fee');
		}

		const newAttributes = JSON.stringify({
			...attributes,
			quantity: attributes.quantity + 1,
		});

		try {
			await this._nftMethod.setAttributes(
				context.getMethodContext(),
				'business',
				nftID,
				Buffer.from(newAttributes),
			);
		} catch (error) {
			console.log('Error setting attributes:', error);
			throw new Error('Error setting attributes');
		}
	}
}
