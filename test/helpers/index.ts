import {
	CommandExecuteContext,
	CommandVerifyContext,
} from 'klayr-framework/dist-node/state_machine';
import { Transaction, cryptography, testing } from 'klayr-sdk';

export type contextType = 'verify' | 'execute';

export function createSampleTransaction(
	params: Buffer,
	command: string,
	sender?: string,
	fee?: bigint,
) {
	return {
		module: 'mint',
		command,
		senderPublicKey: Buffer.from(
			sender ?? 'c1f5cbe79363efd6ba5cc9c80f9f405e7cea0bb9e7824875f7fb3305e08886d0',
			'hex',
		),
		nonce: BigInt(0),
		fee: fee ?? BigInt(10000000),
		params,
		signatures: [cryptography.utils.getRandomBytes(64)],
	};
}

export function createCtx<T>(
	stateStore: any,
	transaction: Transaction,
	schema: any,
	contextType: contextType,
): CommandVerifyContext<T> | CommandExecuteContext<T> {
	const context = testing.createTransactionContext({
		stateStore,
		transaction,
		header: testing.createFakeBlockHeader({}),
	});

	return contextType === 'verify'
		? context.createCommandVerifyContext<T>(schema)
		: context.createCommandExecuteContext<T>(schema);
}
