/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft/method';
import { Modules, StateMachine } from 'klayr-sdk';
import { upgradeNftParamsSchema } from '../schemas';

interface Params {
	module: string;
	nftID: Buffer;
	attributes: Buffer;
}

export class UpgradeNftCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = upgradeNftParamsSchema;

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
		const { nftID, module, attributes } = context.params;

		await this._nftMethod.setAttributes(context.getMethodContext(), module, nftID, attributes);
	}
}
