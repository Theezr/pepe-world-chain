const hexToBuffer = hex => {
	return Buffer.from(hex, 'hex');
};

const decodeAttributes = hexString => {
	const buffer = Buffer.from(hexString, 'hex');
	const jsonString = buffer.toString('utf8');
	const attributes = JSON.parse(jsonString);
	return attributes;
};

// Example usage
const response = {
	id: '01371337621b98d40000000000000000',
	attributesArray: [
		{
			module: 'mint',
			attributes: '7b226c6576656c223a312c227478706572736563223a352c22657463223a226865656c227d',
		},
	],
	lockingModule: 'nft',
};

const hexString = response.attributesArray[0].attributes;
const decodedAttributes = decodeAttributes(hexString);

console.log(decodedAttributes);
// Output: { level: 1, txpersec: 5, etc: 'heel' }
