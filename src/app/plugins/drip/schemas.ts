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

export const configSchema = {
	$id: '#/plugins/klayrFaucet/config',
	type: 'object',
	properties: {
		port: {
			type: 'integer',
			minimum: 1,
			maximum: 65535,
		},
		host: {
			type: 'string',
			format: 'ip',
		},
		encryptedPrivateKey: {
			type: 'string',
			description: 'Encrypted private key of the faucet account',
		},
		tokenID: {
			type: 'string',
			format: 'hex',
			description: 'TokenID of faucet',
		},
		applicationUrl: {
			type: 'string',
			format: 'uri',
			description: 'URL to connect',
		},
		fee: {
			type: 'string',
			description: 'The transaction fee used to faucet an account',
		},
		amount: {
			type: 'string',
			description: 'Number of tokens to fund an account per request',
		},
		tokenPrefix: {
			type: 'string',
			description: 'The token prefix associated with your application',
		},
	},
	required: ['tokenID', 'encryptedPrivateKey'],
	default: {
		port: 4004,
		host: '127.0.0.1',
		applicationUrl: 'ws://localhost:7887/rpc-ws',
		fee: '0.1',
		amount: '1',
		tokenPrefix: 'kly',
	},
};

export const fundParamsSchema = {
	$id: '/klayr/faucet/fund',
	type: 'object',
	required: ['address'],
	properties: {
		address: {
			type: 'string',
			format: 'klayr32',
		},
	},
};

export const getNftsParamsSchema = {
	$id: '/klayr/faucet/fund',
	type: 'object',
	required: ['address'],
	properties: {
		address: {
			type: 'string',
			format: 'klayr32',
			fieldNumber: 1,
		},
	},
};

export const mintSchema = {
	$id: '/klayr/faucet/fund',
	type: 'object',
	required: ['address', 'type'],
	properties: {
		address: {
			type: 'string',
			format: 'klayr32',
			fieldNumber: 1,
		},
		type: {
			type: 'string',
			fieldNumber: 2,
		},
	},
};

export const authorizeParamsSchema = {
	$id: '/klayr/faucet/auth',
	type: 'object',
	required: ['password', 'enable'],
	properties: {
		password: {
			type: 'string',
		},
		enable: {
			type: 'boolean',
		},
	},
};

export const claimRevenueSchema = {
	$id: 'ClaimRewardsCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const stakeSchema = {
	$id: 'StakeCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'string',
			fieldNumber: 1,
		},
		method: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
	required: ['nftID', 'method'],
};
