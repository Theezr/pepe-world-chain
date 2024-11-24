/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules, StateMachine } from 'klayr-sdk';
import { createFirstPepeSchema } from '../schemas';

interface Params {
	recipient: Buffer;
}

const collectionID = Buffer.from('1');
const attributesArray = [
	{
		module: 'stats',
		attributes: Buffer.from(
			JSON.stringify({
				pepeRewardPerSec: 20,
			}),
		),
	},
];

export class CreateFirstPepeCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = createFirstPepeSchema;

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
		const { recipient } = context.params;

		await this._nftMethod.create(
			context.getMethodContext(),
			recipient,
			collectionID,
			attributesArray,
		);
	}
}
