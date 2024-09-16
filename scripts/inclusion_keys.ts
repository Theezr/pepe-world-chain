// 1. Calculate the MODULE_PREFIX using the Interoperability module.
import { cryptography } from '@klayr/client';

const mainchain_chain_id = '01000000';
const sidechain_id = '01371337';

const MODULE_PREFIX = Buffer.from('83ed0d25', 'hex');

// 2. Calculate the SUBSTORE_PREFIX using the Outbox Substore.
const SUBSTORE_PREFIX = Buffer.from('0000', 'hex');

// 3. Calculate the STORE_KEY using the Chain ID of a sidechain.
const STORE_KEY = Buffer.from(mainchain_chain_id, 'hex');
const STORE_KEY_SIDECHAIN = Buffer.from(sidechain_id, 'hex');

// 4. Finally, calculate the inclusionProofKeys as described below:
const inclusionProofKeysMainchain = Buffer.concat([
	MODULE_PREFIX,
	SUBSTORE_PREFIX,
	cryptography.utils.hash(STORE_KEY),
]);
const inclusionProofKeysSidechain = Buffer.concat([
	MODULE_PREFIX,
	SUBSTORE_PREFIX,
	cryptography.utils.hash(STORE_KEY_SIDECHAIN),
]);

console.log(`Mainchain Key: ["${inclusionProofKeysMainchain.toString('hex')}"`);
console.log(`Sidechain Key: ["${inclusionProofKeysSidechain.toString('hex')}"`);
