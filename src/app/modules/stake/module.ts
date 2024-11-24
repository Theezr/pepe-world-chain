/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { Modules } from 'klayr-sdk';
import { StakePepeCommand } from './commands/stake_pepe_command';
import { StakeEndpoint } from './endpoint';
import { StakeMethod } from './method';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { StakeTimeStore } from './stores/stakeTime';
import {
	getStakerRequestSchema,
	getStakerResponseSchema,
} from 'klayr-framework/dist-node/modules/pos/schemas';

export class StakeModule extends Modules.BaseModule {
	public endpoint = new StakeEndpoint(this.stores, this.offchainStores);
	public method = new StakeMethod(this.stores, this.events);

	public _stakePepeCommand = new StakePepeCommand(this.stores, this.events);
	public commands = [this._stakePepeCommand];

	public _nftMethod!: NFTMethod;

	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(StakeTimeStore, new StakeTimeStore(this.name, 0));
	}

	public addDependencies(args: { nftMethod: NFTMethod }): void {
		this._nftMethod = args.nftMethod;

		this._stakePepeCommand.addDependencies({
			nftMethod: this._nftMethod,
		});

		this.endpoint.addDependencies(this._nftMethod);
	}

	public metadata(): Modules.ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [
				{
					name: this.endpoint.getStakeRewards.name,
					request: getStakerRequestSchema,
					response: getStakerResponseSchema,
				},
			],
			assets: [],
		};
	}

	// Lifecycle hooks
	// public async init(_args: Modules.ModuleInitArgs): Promise<void> {
	// 	// initialize this module when starting a node
	// }

	// public async insertAssets(_context: StateMachine.InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: StateMachine.BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	// public async verifyTransaction(_context: StateMachine.TransactionVerifyContext): Promise<StateMachine.VerificationResult> {
	// verify transaction will be called multiple times in the transaction pool
	// return { status: StateMachine.VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {
	// }

	// public async afterCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {

	// }
	// public async initGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async finalizeGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async beforeTransactionsExecute(_context: StateMachine.BlockExecuteContext): Promise<void> {

	// }

	// public async afterTransactionsExecute(_context: StateMachine.BlockAfterExecuteContext): Promise<void> {

	// }
}
