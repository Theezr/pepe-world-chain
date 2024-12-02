/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { upgradeBusinessSchema } from '../schemas';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { TokenMethod } from 'klayr-framework/dist-node/modules/token';

interface Attributes {
	name: string;
	quantity: number;
	revenue: number;
}

interface Params {
	nftID: Buffer;
}

export class UpgradeBusinessCommand extends Modules.BaseCommand {
	private _tokenMethod!: TokenMethod;
	private _nftMethod!: NFTMethod;

	public schema = upgradeBusinessSchema;
	public chainTokenID = Buffer.from('0137133700000000', 'hex');

	public addDependencies(args: { tokenMethod: TokenMethod; nftMethod: NFTMethod }) {
		this._tokenMethod = args.tokenMethod;
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

		const attributes: Attributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		const fee = this.calculateFee(attributes);

		const userBalance = await this._tokenMethod.getAvailableBalance(
			context,
			nft.owner,
			this.chainTokenID,
		);
		console.log('userBalance:', userBalance);

		if (BigInt(userBalance) < BigInt(fee)) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Insufficient funds') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;

		const nft = await this._nftMethod.getNFT(context, nftID);
		const attributes: Attributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		const fee = this.calculateFee(attributes);
		try {
			await this._tokenMethod.burn(context, nft.owner, this.chainTokenID, BigInt(fee));
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
				nft.lockingModule!,
				nftID,
				Buffer.from(newAttributes),
			);
		} catch (error) {
			console.log('Error setting attributes:', error);
			throw new Error('Error setting attributes');
		}
	}

	private calculateFee(_: Attributes): number {
		return 10000000000000000000000000000;
	}
}
