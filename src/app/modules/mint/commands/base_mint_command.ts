/* eslint-disable class-methods-use-this */
import { TokenMethod } from 'klayr-framework/dist-node/modules/token';
import { Modules, StateMachine } from 'klayr-sdk';
import { mintSchema } from '../schemas';
import { TokenID } from 'klayr-framework/dist-node/modules/token/types';

interface MintParams {
	tokenID: TokenID;
	amount: bigint;
	recipient: string;
}

export class BaseMintCommand extends Modules.BaseCommand {
	private _tokenMethod!: TokenMethod;

	public schema = mintSchema;

	public addDependencies(args: { tokenMethod: TokenMethod }) {
		this._tokenMethod = args.tokenMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<MintParams>,
	): Promise<StateMachine.VerificationResult> {
		const { amount } = context.params;

		console.log({ amount });

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<MintParams>): Promise<void> {
		const { recipient, amount, tokenID } = context.params;
		console.log('executing mint command');
		console.log({ recipient, amount, tokenID });

		await this._tokenMethod.initializeToken(context.getMethodContext(), Buffer.from(tokenID));
		await this._tokenMethod.mint(
			context.getMethodContext(),
			Buffer.from(recipient),
			Buffer.from(tokenID),
			BigInt(amount),
		);
	}
}
