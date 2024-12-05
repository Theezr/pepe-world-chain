/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules } from 'klayr-sdk';
import { ClaimRewardsCommand } from './commands/claim_rewards_command';
import { CreateFirstBusinessCommand } from './commands/create_first_business_command';
import { CreateFirstPepeCommand } from './commands/create_first_pepe_command';
import { LevelWorkerCommand } from './commands/level_worker_command';
import { StakePepeCommand } from './commands/stake_pepe_command';
import { UnstakePepeCommand } from './commands/unstake_pepe_command';
import { UpgradeBusinessCommand } from './commands/upgrade_business_command';
import { StakeEndpoint } from './endpoint';
import { StakeMethod } from './method';
import { BusinessStore } from './stores/businessStore';
import { StakeTimeStore } from './stores/stakeTime';
import { WorkerStore } from './stores/workerStore';
import { WorkerStakedStore } from './stores/workerStakedStore';

export class StakeModule extends Modules.BaseModule {
	public endpoint = new StakeEndpoint(this.stores, this.offchainStores);
	public method = new StakeMethod(this.stores, this.events);

	public _stakePepeCommand = new StakePepeCommand(this.stores, this.events);
	public _unstakePepeCommand = new UnstakePepeCommand(this.stores, this.events);
	public _claimRewardsCommand = new ClaimRewardsCommand(this.stores, this.events);
	public _createFirstPepeCommand = new CreateFirstPepeCommand(this.stores, this.events);
	public _createFirstBusinessCommand = new CreateFirstBusinessCommand(this.stores, this.events);
	public _upgradeBusinessCommand = new UpgradeBusinessCommand(this.stores, this.events);
	public _levelWorkerCommand = new LevelWorkerCommand(this.stores, this.events);

	public commands = [
		this._stakePepeCommand,
		this._claimRewardsCommand,
		this._unstakePepeCommand,
		this._createFirstPepeCommand,
		this._createFirstBusinessCommand,
		this._upgradeBusinessCommand,
		this._levelWorkerCommand,
	];

	public _nftMethod!: NFTMethod;
	public _tokenMethod!: Modules.Token.TokenMethod;

	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(StakeTimeStore, new StakeTimeStore(this.name, 0));
		this.stores.register(WorkerStore, new WorkerStore(this.name, 1));
		this.stores.register(BusinessStore, new BusinessStore(this.name, 2));
		this.stores.register(WorkerStakedStore, new WorkerStakedStore(this.name, 3));
	}

	public addDependencies(args: {
		tokenMethod: Modules.Token.TokenMethod;
		nftMethod: NFTMethod;
	}): void {
		this._nftMethod = args.nftMethod;
		this._tokenMethod = args.tokenMethod;

		this._stakePepeCommand.addDependencies({
			nftMethod: this._nftMethod,
		});

		this._unstakePepeCommand.addDependencies({
			method: this.method,
			nftMethod: this._nftMethod,
		});

		this._claimRewardsCommand.addDependencies({
			method: this.method,
			nftMethod: this._nftMethod,
		});

		this._levelWorkerCommand.addDependencies({
			method: this.method,
			nftMethod: this._nftMethod,
		});

		this._createFirstPepeCommand.addDependencies({
			method: this.method,
			nftMethod: this._nftMethod,
		});

		this._createFirstBusinessCommand.addDependencies({
			method: this.method,
			nftMethod: this._nftMethod,
		});

		this._upgradeBusinessCommand.addDependencies({
			method: this.method,
			tokenMethod: this._tokenMethod,
			nftMethod: this._nftMethod,
		});

		this.method.addDependencies({
			tokenMethod: this._tokenMethod,
			nftMethod: this._nftMethod,
		});
		this.endpoint.addDependencies(this.method);
	}

	public metadata(): Modules.ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [
				// {
				// 	name: this.endpoint.getStakeRewards.name,
				// 	request: getStakerRequestSchema,
				// 	response: getStakerResponseSchema,
				// },
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
