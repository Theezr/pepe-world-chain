/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { Modules } from 'klayr-sdk';
import { CreateFirstPepeCommand } from './commands/create_first_pepe_command';
import { NftFactoryEndpoint } from './endpoint';
import { NftFactoryMethod } from './method';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';

export class NftFactoryModule extends Modules.BaseModule {
	public endpoint = new NftFactoryEndpoint(this.stores, this.offchainStores);
	public method = new NftFactoryMethod(this.stores, this.events);
	public _createFirstPepeCommand = new CreateFirstPepeCommand(this.stores, this.events);
	public commands = [this._createFirstPepeCommand];

	public _nftMethod!: NFTMethod;

	public constructor() {
		super();
		// registeration of stores and events
	}

	public addDependencies(args: { nftMethod: NFTMethod }): void {
		this._nftMethod = args.nftMethod;

		this._createFirstPepeCommand.addDependencies({
			nftMethod: this._nftMethod,
		});
	}

	public metadata(): Modules.ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [],
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
