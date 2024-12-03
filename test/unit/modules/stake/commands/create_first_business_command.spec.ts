import { CreateFirstBusinessCommand } from '../../../../../src/app/modules/stake/commands/create_first_business_command';

describe('CreateFirstBusinessCommand', () => {
  let command: CreateFirstBusinessCommand;

	beforeEach(() => {
		command = new CreateFirstBusinessCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('createFirstBusiness');
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
