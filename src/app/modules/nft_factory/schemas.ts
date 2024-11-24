export const createFirstPepeSchema = {
	$id: 'CreateFirstPepeCommand',
	type: 'object',
	properties: {
		recipient: {
			dataType: 'bytes',
			fieldNumber: 1,
			format: 'klayr32',
		},
	},
	required: ['recipient'],
};
