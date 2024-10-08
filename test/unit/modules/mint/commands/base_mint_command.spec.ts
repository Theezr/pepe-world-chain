import { utils } from '@klayr/cryptography';
import { BaseMintCommand } from '../../../../../src/app/modules/mint/commands/base_mint_command';
import { MintModule } from '../../../../../src/app/modules/mint/module';
import { chain, codec, db, Transaction } from 'klayr-sdk';
import { mintSchema } from '../../../../../src/app/modules/mint/schemas';
import { createCtx, createSampleTransaction } from '../../../../helpers';
import { CommandExecuteContext, VerifyStatus } from 'klayr-framework/dist-node/state_machine';

interface MintParams {
	amount: bigint;
	recipient: string;
}

const mockMint = jest.fn();

describe('MintModule', () => {
	let baseMintCommand: BaseMintCommand;
	let stateStore: any;

	beforeEach(() => {
		const mintModule = new MintModule();
		baseMintCommand = new BaseMintCommand(mintModule.stores, mintModule.events);
		baseMintCommand.addDependencies({
			tokenMethod: { mint: mockMint } as any,
		});

		stateStore = new chain.StateStore(new db.InMemoryDatabase());
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(baseMintCommand.name).toEqual('baseMint');
		});

		it('should have valid schema', () => {
			expect(baseMintCommand.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			it('should throw when `amount` is too high', async () => {
				const params = codec.encode(mintSchema, {
					amount: BigInt(2e6),
					recipient: utils.getRandomBytes(20),
				});
				const transaction = new Transaction(createSampleTransaction(params, BaseMintCommand.name));
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'verify');

				const result = await baseMintCommand.verify(ctx);
				expect(result.status).toBe(VerifyStatus.OK);
			});
			it.todo('should be ok for valid schema');
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it('mint function should have been called` ', async () => {
				const params = codec.encode(mintSchema, {
					amount: BigInt(2e6),
					recipient: utils.getRandomBytes(20),
				});
				const transaction = new Transaction(createSampleTransaction(params, BaseMintCommand.name));
				const ctx = createCtx<MintParams>(stateStore, transaction, mintSchema, 'execute');

				await expect(
					baseMintCommand.execute(ctx as CommandExecuteContext<MintParams>),
				).resolves.toBeUndefined();
			});

			it.todo('should update the state store');
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
