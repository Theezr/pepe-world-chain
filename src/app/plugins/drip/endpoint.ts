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
import {
	authorizeParamsSchema,
	claimRevenueSchema,
	getNftsParamsSchema,
	mintSchema,
	stakeSchema,
} from './schemas';
import { DripPluginConfig, State } from './types';
import { businessData } from '../../nftTypes';

import { decodeAttributes, isValidBusinessType, isValidWorkerType } from './helpers';

// disabled for type annotation
// eslint-disable-next-line prefer-destructuring
const validator: klayrvalidator.KlayrValidator = klayrvalidator.validator;
const pepeTokenID = '0137133700000000';

interface ReturnType {
	command: string;
	address: string;
	message: string;
}

interface SendTransactionParams {
	context: Types.PluginEndpointContext;
	module: string;
	command: string;
	params: Record<string, unknown>;
	successMessage: string;
}

export class Endpoint extends Plugins.BasePluginEndpoint {
	private _state: State = { publicKey: undefined, privateKey: undefined, address: undefined };
	private _client!: Plugins.BasePlugin['apiClient'];
	private _config!: DripPluginConfig;
	// private nonce: string = '';

	public init(state: State, apiClient: Plugins.BasePlugin['apiClient'], config: DripPluginConfig) {
		this._state = state;
		this._client = apiClient;
		this._config = config;
	}

	// eslint-disable-next-line @typescript-eslint/require-await

	private async _sendTransaction({
		context,
		module,
		command,
		params,
		successMessage,
	}: SendTransactionParams): Promise<ReturnType> {
		context.logger.info('your log');
		console.log({ params });
		if (!this._state.publicKey || !this._state.privateKey) {
			throw new Error('Faucet is not enabled.');
		}

		const transaction = await this._client.transaction.create(
			{
				module,
				command,
				senderPublicKey: this._state.publicKey?.toString('hex'),
				fee: transactions.convertklyToBeddows(this._config.fee),
				params,
				// nonce: this.nonce,
			},
			this._state.privateKey?.toString('hex') as string,
		);

		// this.nonce = (parseInt(this.nonce) + 1).toString();
		console.log('before sent');
		try {
			await this._client.transaction.send(transaction);
		} catch (error) {
			console.log('error:', error);
			throw new Error(`Error Sending TX ${command} ${error}`);
		}

		return {
			command: command,
			address: (context.params.address as string) || '',
			message: successMessage,
		};
	}

	public async mintPepeBusiness(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(mintSchema, context.params);
		const { address, type } = context.params;

		if (!isValidBusinessType(type as string)) {
			throw new Error('Invalid business type');
		}

		return this._sendTransaction({
			context,
			module: 'stake',
			command: 'createFirstBusiness',
			params: { recipient: address, type },
			successMessage: 'Successfully created pepe business tx',
		});
	}

	public async mintPepeWorker(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(mintSchema, context.params);
		const { address, type } = context.params;

		if (!isValidWorkerType(type as string)) {
			throw new Error('Invalid worker type');
		}

		return this._sendTransaction({
			context,
			module: 'stake',
			command: 'createFirstPepe',
			params: { recipient: address, type },
			successMessage: 'Successfully created pepe worker tx',
		});
	}

	public async claimRevenue(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(claimRevenueSchema, context.params);
		const { nftID } = context.params;

		return this._sendTransaction({
			context,
			module: 'stake',
			command: 'claimRewards',
			params: { nftID },
			successMessage: 'Successfully claimed revenue',
		});
	}

	public async stakeUnstakePepe(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(stakeSchema, context.params);
		const { nftID, method } = context.params;

		return this._sendTransaction({
			context,
			module: 'stake',
			command: method as string,
			params: { nftID },
			successMessage: 'Successfully unstaked pepe',
		});
	}

	public async upgradeBusiness(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(claimRevenueSchema, context.params);
		const { nftID } = context.params;

		return this._sendTransaction({
			context,
			module: 'stake',
			command: 'upgradeBusiness',
			params: { nftID },
			successMessage: 'Successfully upgraded business',
		});
	}

	public async levelUpWorker(context: Types.PluginEndpointContext): Promise<ReturnType> {
		validator.validate(claimRevenueSchema, context.params);
		const { nftID } = context.params;

		return this._sendTransaction({
			context,
			module: 'stake',
			command: 'levelWorker',
			params: { nftID },
			successMessage: 'Successfully leveled worker',
		});
	}

	public async getNftsForAddress(
		context: Types.PluginEndpointContext,
	): Promise<{ command: string; workers: any; businesses: any; tokens: any }> {
		validator.validate(getNftsParamsSchema, context.params);
		const { address } = context.params;

		const nfts = await this._client.invoke('nft_getNFTs', {
			address,
		});
		const tokenBalance = await this._client.invoke('token_getBalance', {
			address,
			tokenID: pepeTokenID,
		});

		const nftArray = nfts.nfts as any[];

		const decodedNfts = await Promise.all(
			nftArray.map(async nft => {
				const decodedAttributesArray = nft.attributesArray.map(attribute => {
					const decodedAttributes = decodeAttributes(attribute.attributes);
					return {
						...attribute,
						attributes: decodedAttributes,
					};
				});

				if (decodedAttributesArray[0].module === 'business') {
					return this.processBusinessNft(nft, decodedAttributesArray);
				} else if (decodedAttributesArray[0].module === 'worker') {
					return this.processWorkerNft(nft, decodedAttributesArray, address as string);
				}

				return {
					...nft,
					attributesArray: decodedAttributesArray,
				};
			}),
		);

		const workers = decodedNfts.filter(nft => nft.attributesArray[0].module === 'worker');
		const businesses = decodedNfts.filter(nft => nft.attributesArray[0].module === 'business');

		// console.log('Worker NFTs:', workers);
		// console.log('Business NFTs:', businesses);

		return {
			command: 'nfts',
			workers,
			businesses,
			tokens: tokenBalance,
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

			// const account = await this._client.invoke('auth_getAuthAccount', {
			// 	address: this._state.address,
			// });

			// console.log('nonce:', account);
			// this.nonce = account.nonce as string;

			return {
				result: `Successfully ${changedState} the dripper.`,
			};
		} catch (error) {
			throw new Error('Password given is not valid.');
		}
	}

	private async processBusinessNft(nft: any, decodedAttributesArray: any[]): Promise<any> {
		let unclaimedRevenue = 0;
		let upgradeCost = 0;
		let revenue = 0;

		unclaimedRevenue = await this._client.invoke('stake_getStakeRewardsForNft', {
			nftID: nft.id,
		});
		upgradeCost = await this._client.invoke('stake_getUpgradeCost', {
			nftID: nft.id,
		});
		revenue = await this._client.invoke('stake_getRevenue', {
			nftID: nft.id,
		});

		const nftDefaults = businessData[decodedAttributesArray[0].attributes.type];
		const maxRevenue = nftDefaults?.maxRevenue ?? 0;

		return {
			...nft,
			attributesArray: decodedAttributesArray,
			maxRevenue: maxRevenue * decodedAttributesArray[0].attributes.quantity,
			baseRevenue: nftDefaults?.baseRevenue ?? 0,
			revenue: revenue,
			upgradeCost,
			unclaimedRevenue,
			typeMultiplier: nftDefaults?.typeMultiplier ?? 1,
		};
	}

	private async processWorkerNft(
		nft: any,
		decodedAttributesArray: any[],
		address: string,
	): Promise<any> {
		const experienceToNextLevel = await this._client.invoke('stake_getExperienceToNextLevel', {
			nftID: nft.id,
		});

		const experienceStakedWorker = await this._client.invoke('stake_getExperienceStakedWorker', {
			address,
		});

		const nextLevelMultipliers = await this._client.invoke('stake_getNewMultipliers', {
			nftID: nft.id,
		});

		return {
			...nft,
			attributesArray: decodedAttributesArray,
			experienceToNextLevel,
			experience: experienceStakedWorker,
			nextLevelMultipliers,
		};
	}
}
