/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft/method';
import { Modules, StateMachine } from 'klayr-sdk';
import { mintNftParamsSchema } from '../schemas';

export interface NFTAttributes {
	module: string;
	attributes: Buffer;
}

interface Params {
	address: Buffer;
	collectionID: Buffer;
	attributesArray: NFTAttributes[];
}

export class CreateNftCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = mintNftParamsSchema;

	public addDependencies(args: { nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		_context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { address, collectionID, attributesArray } = context.params;

		await this._nftMethod.create(
			context.getMethodContext(),
			address,
			collectionID,
			attributesArray,
		);
	}
}
