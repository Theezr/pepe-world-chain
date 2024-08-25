/*
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

import { Plugins, Types, cryptography, validator as klayrvalidator, transactions } from 'klayr-sdk';
import { authorizeParamsSchema, fundParamsSchema } from './schemas';
import { DripPluginConfig, State } from './types';

// disabled for type annotation
// eslint-disable-next-line prefer-destructuring
const validator: klayrvalidator.KlayrValidator = klayrvalidator.validator;

export class Endpoint extends Plugins.BasePluginEndpoint {
	private _state: State = { publicKey: undefined, privateKey: undefined, address: undefined };
	private _client!: Plugins.BasePlugin['apiClient'];
	private _config!: DripPluginConfig;

	public init(state: State, apiClient: Plugins.BasePlugin['apiClient'], config: DripPluginConfig) {
		this._state = state;
		this._client = apiClient;
		this._config = config;
	}
	// eslint-disable-next-line @typescript-eslint/require-await

	public async fundTokens(context: Types.PluginEndpointContext): Promise<{ result: string }> {
		validator.validate(fundParamsSchema, context.params);
		const { address } = context.params;

		if (!this._state.publicKey || !this._state.privateKey) {
			throw new Error('Faucet is not enabled.');
		}

		await this._transferFunds(address as string);

		return {
			result: `Successfully funded account at address: ${address as string}.`,
		};
	}

	private async _transferFunds(address: string): Promise<void> {
		const transferTransactionParams = {
			tokenID: this._config.tokenID,
			amount: transactions.convertklyToBeddows(this._config.amount),
			recipientAddress: address,
			data: '',
		};

		const transaction = await this._client.transaction.create(
			{
				module: 'token',
				command: 'transfer',
				senderPublicKey: this._state.publicKey?.toString('hex'),
				fee: transactions.convertklyToBeddows(this._config.fee), // TODO: The static fee should be replaced by fee estimation calculation
				params: transferTransactionParams,
			},
			this._state.privateKey?.toString('hex') as string,
		);

		await this._client.transaction.send(transaction);
	}

	public async authorize(context: Types.PluginEndpointContext): Promise<{ result: string }> {
		validator.validate<{ enable: boolean; password: string }>(
			authorizeParamsSchema,
			context.params,
		);

		const { enable, password } = context.params;

		try {
			const parsedEncryptedKey = cryptography.encrypt.parseEncryptedMessage(
				this._config.encryptedPrivateKey,
			);

			const privateKeyStr = await cryptography.encrypt.decryptMessageWithPassword(
				parsedEncryptedKey,
				password,
				'utf-8',
			);
			const privateKey = Buffer.from(privateKeyStr, 'hex');

			const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);

			this._state.privateKey = enable ? privateKey : undefined;
			this._state.publicKey = enable ? publicKey : undefined;
			this._state.address = enable
				? cryptography.address.getKlayr32AddressFromPublicKey(publicKey, this._config.tokenPrefix)
				: undefined;
			const changedState = enable ? 'enabled' : 'disabled';

			return {
				result: `Successfully ${changedState} the dripper.`,
			};
		} catch (error) {
			throw new Error('Password given is not valid.');
		}
	}
}
