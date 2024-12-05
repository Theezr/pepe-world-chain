import { Modules } from 'klayr-sdk';

export interface WorkerStakedData {
	nftID: Buffer;
	experience: bigint;
}

export const workerStakedSchema = {
	$id: '/stake/workerStaked',
	type: 'object',
	required: ['nftID', 'experience'],
	properties: {
		nftID: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		experience: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
	},
};

export class WorkerStakedStore extends Modules.BaseStore<WorkerStakedData> {
	public schema = workerStakedSchema;
}
