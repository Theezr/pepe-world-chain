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
