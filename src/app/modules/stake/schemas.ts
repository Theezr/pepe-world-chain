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
