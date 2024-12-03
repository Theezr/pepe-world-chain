import { Modules } from 'klayr-sdk';

export interface WorkerData {
	minted: boolean;
}

export const workerSchema = {
	$id: '/nftFactory/worker',
	type: 'object',
	required: ['minted'],
	properties: {
		minted: {
			dataType: 'boolean',
			fieldNumber: 1,
		},
	},
};

export class WorkerStore extends Modules.BaseStore<WorkerData> {
	public schema = workerSchema;
}
