/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft/method';
import { TokenMethod } from 'klayr-framework/dist-node/modules/token';
import { Modules } from 'klayr-sdk';
import { BaseMintCommand } from './commands/base_mint_command';
import { CreateNftCommand } from './commands/create_nft_command';
import { UpgradeNftCommand } from './commands/upgrade_nft_command';
import { MintEndpoint } from './endpoint';
import { MintMethod } from './method';

export class MintModule extends Modules.BaseModule {
	public endpoint = new MintEndpoint(this.stores, this.offchainStores);
	public method = new MintMethod(this.stores, this.events);
	public _baseMintCommand = new BaseMintCommand(this.stores, this.events);
	public _createNftCommand = new CreateNftCommand(this.stores, this.events);
	public _upgradeNftCommand = new UpgradeNftCommand(this.stores, this.events);

	public commands = [this._baseMintCommand, this._createNftCommand, this._upgradeNftCommand];

	public _tokenMethod!: TokenMethod;
	public _nftMethod!: NFTMethod;

	public constructor() {
		super();
		// registeration of stores and events
	}

	public addDependencies(args: { tokenMethod: TokenMethod; nftMethod: NFTMethod }): void {
		this._tokenMethod = args.tokenMethod;
		this._nftMethod = args.nftMethod;

		this._baseMintCommand.addDependencies({
			tokenMethod: this._tokenMethod,
		});

		this._createNftCommand.addDependencies({
			nftMethod: this._nftMethod,
		});

		this._upgradeNftCommand.addDependencies({
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
	public async init(_args: Modules.ModuleInitArgs): Promise<void> {
		// initialize this module when starting a node
	}

	// public async insertAssets(_context: StateMachine.InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: StateMachine.BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	// public async verifyTransaction(
	// 	_context: StateMachine.TransactionVerifyContext,
	// ): Promise<StateMachine.VerificationResult> {
	// 	// verify transaction will be called multiple times in the transaction pool
	// 	return { status: StateMachine.VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(
	// 	context: StateMachine.TransactionExecuteContext,
	// ): Promise<void> {
	// 	const test = await context
	// 		.getMethodContext()
	// 		.contextStore.set('CONTEXT_STORE_KEY_AVAILABLE_FEE', BigInt(100000000000000));
	// 	console.log('test', test);
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
