/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { levelWorkerSchema } from '../schemas';
import { StakeMethod } from '../method';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { WorkerAttributes } from '../types';
import { WorkerStakedStore } from '../stores/workerStakedStore';

interface Params {
	nftID: Buffer;
}

export class LevelWorkerCommand extends Modules.BaseCommand {
	private _method!: StakeMethod;
	private _nftMethod!: NFTMethod;

	public schema = levelWorkerSchema;

	public addDependencies(args: { method: StakeMethod; nftMethod: NFTMethod }) {
		this._method = args.method;
		this._nftMethod = args.nftMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<Params>,
	): Promise<StateMachine.VerificationResult> {
		const { nftID } = context.params;
		const nft = await this._nftMethod.getNFT(context, nftID);
		const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		const workerStakedStore = this.stores.get(WorkerStakedStore);
		const hasWorkerStaked = await workerStakedStore.has(context, nft.owner);
		if (!hasWorkerStaked) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Worker not staked') };
		}

		const experienceNeeded = this._method.calculateExperienceToNextLevel(attributes);
		const stakedWorker = await workerStakedStore.get(context, nft.owner);
		if (stakedWorker.experience < experienceNeeded) {
			return { status: StateMachine.VerifyStatus.FAIL, error: new Error('Not enough experience') };
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(context: StateMachine.CommandExecuteContext<Params>): Promise<void> {
		const { nftID } = context.params;
		const nft = await this._nftMethod.getNFT(context, nftID);
		const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		const newMultipliers = this._method.calculateNewMultipliers(attributes);

		const newAttributes = JSON.stringify({
			...attributes,
			quantity: attributes.level + 1,
			revMultiplier: newMultipliers.newRevMultiplier,
			capMultiplier: newMultipliers.newCapMultiplier,
		});

		try {
			await this._nftMethod.setAttributes(
				context.getMethodContext(),
				'worker',
				nftID,
				Buffer.from(newAttributes),
			);
			const workerStakedStore = this.stores.get(WorkerStakedStore);
			await workerStakedStore.set(context, nft.owner, { nftID, experience: BigInt(0) });
		} catch (error) {
			console.log('Error setting attributes:', error);
			throw new Error('Error setting attributes');
		}
	}
}
