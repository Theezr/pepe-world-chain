import { UpgradeBusinessCommand } from '../../../../../src/app/modules/stake/commands/upgrade_business_command';

describe('UpgradeBusinessCommand', () => {
  let command: UpgradeBusinessCommand;

	beforeEach(() => {
		command = new UpgradeBusinessCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('upgradeBusiness');
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
