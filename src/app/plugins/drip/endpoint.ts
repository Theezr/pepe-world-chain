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
import { authorizeParamsSchema, fundParamsSchema, getNftsParamsSchema } from './schemas';
import { DripPluginConfig, State } from './types';
import { LENGTH_COLLECTION_ID } from 'klayr-framework/dist-node/modules/nft/constants';
import { utils } from '@klayr/cryptography';
import { decodeAttributes } from './helpers';

// disabled for type annotation
// eslint-disable-next-line prefer-destructuring
const validator: klayrvalidator.KlayrValidator = klayrvalidator.validator;

type returnType = {
	type: string;
	message: string;
	address?: string;
};

export class Endpoint extends Plugins.BasePluginEndpoint {
	private _state: State = { publicKey: undefined, privateKey: undefined, address: undefined };
	private _client!: Plugins.BasePlugin['apiClient'];
	private _config!: DripPluginConfig;
	private nonce: string = '';

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
			result: `Successfully funded account at address: ${address as string}`,
		};
	}

	private async _transferFunds(address: string): Promise<void> {
		// const mintParams = {
		// 	tokenID: this._config.tokenID,
		// 	amount: '1',
		// 	recipient: address,
		// 	data: '',
		// };

		const mintNft = {
			// tokenID: this._config.tokenID,
			// amount: transactions.convertklyToBeddows(this._config.amount),
			address: address,
			collectionID: utils.getRandomBytes(LENGTH_COLLECTION_ID),
			attributesArray: [
				{
					module: 'mint',
					attributes: Buffer.from(
						JSON.stringify({
							level: 2,
							txpersec: 10,
							etc: 'heelTest2',
						}),
					),
				},
			],
		};

		// const upgradeNft = {
		// 	nftID: '01371337e7197bfc0000000000000000',
		// 	module: 'mint',
		// 	attributes: Buffer.from('22'),
		// };

		console.log('transferTransactionParams:', mintNft);

		const transaction = await this._client.transaction.create(
			{
				module: 'mint',
				command: 'createNft',
				senderPublicKey: this._state.publicKey?.toString('hex'),
				fee: transactions.convertklyToBeddows(this._config.fee),
				params: mintNft,
				nonce: this.nonce,
			},
			this._state.privateKey?.toString('hex') as string,
		);

		this.nonce = (parseInt(this.nonce) + 1).toString();

		await this._client.transaction.send(transaction);
	}

	private async _mintFirstPepe(
		context: Types.PluginEndpointContext,
		module: string,
		command: string,
		type: string,
		successMessage: string,
	): Promise<returnType> {
		validator.validate(getNftsParamsSchema, context.params);
		const { address } = context.params;

		if (!this._state.publicKey || !this._state.privateKey) {
			throw new Error('Faucet is not enabled.');
		}

		const transaction = await this._client.transaction.create(
			{
				module,
				command,
				senderPublicKey: this._state.publicKey?.toString('hex'),
				fee: transactions.convertklyToBeddows(this._config.fee),
				params: {
					recipient: address,
				},
				nonce: this.nonce,
			},
			this._state.privateKey?.toString('hex') as string,
		);

		this.nonce = (parseInt(this.nonce) + 1).toString();
		try {
			await this._client.transaction.send(transaction);
		} catch (error) {
			console.log('error:', error);
			throw new Error(`Error minting first pepe ${type} ${error}`);
		}

		return {
			type,
			address: address as string,
			message: successMessage,
		};
	}

	public async mintFirstPepeBusiness(context: Types.PluginEndpointContext): Promise<returnType> {
		return this._mintFirstPepe(
			context,
			'stake',
			'createFirstBusiness',
			'mintFirstPepeBusiness',
			'Successfully created pepe business tx',
		);
	}

	public async mintFirstPepeWorker(context: Types.PluginEndpointContext): Promise<returnType> {
		return this._mintFirstPepe(
			context,
			'stake',
			'createFirstPepe',
			'mintFirstPepeWorker',
			'Successfully created pepe worker tx',
		);
	}

	public async getNftsForAddress(
		context: Types.PluginEndpointContext,
	): Promise<{ type: string; workers: any; businesses: any }> {
		validator.validate(getNftsParamsSchema, context.params);
		const { address } = context.params;

		const nfts = await this._client.invoke('nft_getNFTs', {
			address,
		});
		const nftArray = nfts.nfts as any[];

		const decodedNfts = await Promise.all(
			nftArray.map(async nft => {
				const decodedAttributesArray = nft.attributesArray.map(attribute => {
					return {
						...attribute,
						attributes: decodeAttributes(attribute.attributes),
					};
				});

				let unclaimedRevenue = 0;
				if (nft.attributesArray[0].module === 'business') {
					unclaimedRevenue = await this._client.invoke('stake_getStakeRewardsForNft', {
						nftID: nft.id,
					});
				}

				return {
					...nft,
					attributesArray: decodedAttributesArray,
					unclaimedRevenue,
				};
			}),
		);

		const workers = decodedNfts.filter(nft => nft.attributesArray[0].module === 'worker');
		const businesses = decodedNfts.filter(nft => nft.attributesArray[0].module === 'business');

		console.log('Worker NFTs:', workers);
		console.log('Business NFTs:', businesses);

		return {
			type: 'nfts',
			workers,
			businesses,
		};
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

			const account = await this._client.invoke('auth_getAuthAccount', {
				address: this._state.address,
			});

			console.log('nonce:', account);
			this.nonce = account.nonce as string;

			return {
				result: `Successfully ${changedState} the dripper.`,
			};
		} catch (error) {
			throw new Error('Password given is not valid.');
		}
	}
}
