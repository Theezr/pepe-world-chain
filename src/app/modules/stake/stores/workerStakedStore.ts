import { Modules } from 'klayr-sdk';

export interface WorkerStakedData {
	nftID: Buffer;
	experience: bigint;
	revMultiplier: string;
	capMultiplier: string;
}

export const workerStakedSchema = {
	$id: '/stake/workerStaked',
	type: 'object',
	required: ['nftID', 'experience', 'revMultiplier', 'capMultiplier'],
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		experience: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
		revMultiplier: {
			dataType: 'string',
			fieldNumber: 3,
		},
		capMultiplier: {
			dataType: 'string',
			fieldNumber: 4,
		},
	},
};

export class WorkerStakedStore extends Modules.BaseStore<WorkerStakedData> {
	public schema = workerStakedSchema;
}
