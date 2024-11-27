/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules, StateMachine } from 'klayr-sdk';
import { createFirstPepeSchema } from '../schemas';

interface Params {
	recipient: Buffer;
}

const collectionID = Buffer.alloc(4);
const attributesArray = [
	{
		module: 'worker',
		attributes: Buffer.from(
			JSON.stringify({
				name: 'Pepe Normie',
				level: 1,
				multiplier: 200,
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

		try {
			await this._nftMethod.create(
				context.getMethodContext(),
				recipient,
				collectionID,
				attributesArray,
			);
		} catch (e) {
			console.log('error:', e);
		}
	}
}
