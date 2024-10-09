import { UpgradeNftCommand } from '../../../../../src/app/modules/mint/commands/upgrade_nft_command';

describe('UpgradeNftCommand', () => {
  let command: UpgradeNftCommand;

	beforeEach(() => {
		command = new UpgradeNftCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('upgradeNft');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('execute', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
