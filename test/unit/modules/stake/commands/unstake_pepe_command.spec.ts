import { UnstakePepeCommand } from '../../../../../src/app/modules/stake/commands/unstake_pepe_command';

describe('UnstakePepeCommand', () => {
  let command: UnstakePepeCommand;

	beforeEach(() => {
		command = new UnstakePepeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('unstakePepe');
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
