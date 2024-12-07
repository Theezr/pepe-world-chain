import { StakeWorkerCommand } from '../../../../../src/app/modules/stake/commands/stake_worker_command';

describe('StakeWorkerCommand', () => {
  let command: StakeWorkerCommand;

	beforeEach(() => {
		command = new StakeWorkerCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('stakeWorker');
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
