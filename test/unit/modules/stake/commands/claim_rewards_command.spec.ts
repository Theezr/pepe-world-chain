import { ClaimRewardsCommand } from '../../../../../src/app/modules/stake/commands/claim_rewards_command';

describe('ClaimRewardsCommand', () => {
  let command: ClaimRewardsCommand;

	beforeEach(() => {
		command = new ClaimRewardsCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('claimRewards');
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
