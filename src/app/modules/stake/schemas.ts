export const stakePepeSchema = {
	$id: 'StakePepeCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const stakeWorkerSchema = {
	$id: 'StakeWorkerCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const unstakePepeSchema = {
	$id: 'UnstakePepeCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const claimRewardsSchema = {
	$id: 'ClaimRewardsCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const levelWorkerSchema = {
	$id: 'LevelWorkerCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};

export const createWorkerSchema = {
	$id: 'CreatePepeCommand',
	type: 'object',
	properties: {
		recipient: {
			dataType: 'bytes',
			fieldNumber: 1,
			format: 'klayr32',
		},
		type: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
	required: ['recipient', 'type'],
};

export const createBusinessSchema = {
	$id: 'CreateBusinessCommand',
	type: 'object',
	properties: {
		recipient: {
			dataType: 'bytes',
			fieldNumber: 1,
			format: 'klayr32',
		},
		type: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
	required: ['recipient', 'type'],
};

export const upgradeBusinessSchema = {
	$id: 'UpgradeBusinessCommand',
	type: 'object',
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
	required: ['nftID'],
};
