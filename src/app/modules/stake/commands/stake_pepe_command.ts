/* eslint-disable class-methods-use-this */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules, StateMachine } from 'klayr-sdk';
import { stakePepeSchema } from '../schemas';
import { StakeTimeStore } from '../stores/stakeTime';

interface Params {
	nftID: Buffer;
}

export class StakePepeCommand extends Modules.BaseCommand {
	private _nftMethod!: NFTMethod;

	public schema = stakePepeSchema;

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
		const { nftID } = context.params;

		const nft = await this._nftMethod.getNFT(context.getMethodContext(), nftID);
		console.log(nft);

		const attributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		console.log({ attributes });

		const stakeTimeStore = this.stores.get(StakeTimeStore);
		await stakeTimeStore.set(context, nftID, { time: context.header.timestamp });

		const getTest = await stakeTimeStore.get(context, nftID);
		console.log(getTest.time);

		// await this._nftMethod.unlock(context.getMethodContext(), this.name, nftID);
	}
}
