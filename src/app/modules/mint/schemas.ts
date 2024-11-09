import { LENGTH_COLLECTION_ID, MAX_LENGTH_MODULE_NAME, MIN_LENGTH_MODULE_NAME } from './constants';

export const mintSchema = {
	$id: 'BaseMintCommand',
	type: 'object',
	properties: {
		tokenID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		amount: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
		recipient: {
			dataType: 'bytes',
			fieldNumber: 3,
			format: 'klayr32',
		},
	},
	required: ['tokenID', 'amount', 'recipient'],
};
1;
export const createNftSchema = {
	$id: 'CreateNftCommand',
	type: 'object',
	properties: {
		recipient: {
			dataType: 'bytes',
			fieldNumber: 3,
			format: 'klayr32',
		},
	},
	required: ['recipient'],
};

export const mintNftParamsSchema = {
	$id: '/klayr/nftTransferParams',
	type: 'object',
	required: ['address', 'collectionID', 'attributesArray'],
	properties: {
		address: {
			dataType: 'bytes',
			format: 'klayr32',
			fieldNumber: 1,
		},
		collectionID: {
			dataType: 'bytes',
			minLength: LENGTH_COLLECTION_ID,
			maxLength: LENGTH_COLLECTION_ID,
			fieldNumber: 2,
		},
		attributesArray: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['module', 'attributes'],
				properties: {
					module: {
						dataType: 'string',
						minLength: MIN_LENGTH_MODULE_NAME,
						maxLength: MAX_LENGTH_MODULE_NAME,
						pattern: '^[a-zA-Z0-9]*$',
						fieldNumber: 1,
					},
					attributes: {
						dataType: 'bytes',
						fieldNumber: 2,
					},
				},
			},
		},
	},
};

export const upgradeNftParamsSchema = {
	$id: '/klayr/upgradeNftParams',
	type: 'object',
	required: ['nftID', 'module', 'attributes'],
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		module: {
			dataType: 'string',
			minLength: MIN_LENGTH_MODULE_NAME,
			maxLength: MAX_LENGTH_MODULE_NAME,
			pattern: '^[a-zA-Z0-9]*$',
			fieldNumber: 2,
		},
		attributes: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
	},
};
