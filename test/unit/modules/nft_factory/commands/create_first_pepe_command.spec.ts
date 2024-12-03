import { CreateFirstPepeCommand } from '../../../../../src/app/modules/nftFactory/commands/create_first_pepe_command';

describe('CreateFirstPepeCommand', () => {
  let command: CreateFirstPepeCommand;

	beforeEach(() => {
		command = new CreateFirstPepeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('createFirstPepe');
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
