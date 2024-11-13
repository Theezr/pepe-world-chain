// /* eslint-disable consistent-return */
// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// import { codec, cryptography, db as klayrDB } from 'klayr-sdk';
// import * as os from 'os';
// import { join } from 'path';
// import { ensureDir } from 'fs-extra';
// import { DB_LAST_TOKENID_COUNTER_INFO, DB_LAST_HEIGHT_INFO } from './constants';

// const { Database } = klayrDB;
// type KVStore = klayrDB.Database;

// // Returns DB's instance.
// export const getDBInstance = async (
// 	dataPath: string,
// 	dbName = 'lisk-framework-tokenFactoryInfo-plugin.db',
// ): Promise<KVStore> => {
// 	const dirPath = join(dataPath.replace('~', os.homedir()), 'database', dbName);
// 	await ensureDir(dirPath);
// 	return new Database(dirPath);
// };

// // Stores lastCounter for key generation.
// export const setLastTokenID = async (db: KVStore, lastTokenID: Buffer): Promise<void> => {
// 	await db.set(DB_LAST_TOKENID_COUNTER_INFO, lastTokenID);
// };

// // Returns lastCounter.
// export const getLastTokenID = async (db: KVStore): Promise<Buffer> => {
// 	const encodedCounterInfo = await db.get(DB_LAST_TOKENID_COUNTER_INFO);
// 	return encodedCounterInfo;
// };

// // Stores height of block where hello event exists.
// export const setLastEventHeight = async (db: KVStore, lastHeight: number): Promise<void> => {
// 	const encodedHeightInfo = codec.encode(heightSchema, { height: lastHeight });
// 	await db.set(DB_LAST_HEIGHT_INFO, encodedHeightInfo);
// };

// // Returns height of block where hello event exists.
// export const getLastEventHeight = async (db: KVStore): Promise<Height> => {
// 	const encodedHeightInfo = await db.get(DB_LAST_HEIGHT_INFO);
// 	return codec.decode<Height>(heightSchema, encodedHeightInfo);
// };
