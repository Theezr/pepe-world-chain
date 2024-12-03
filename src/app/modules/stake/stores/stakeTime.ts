import { Modules } from 'klayr-sdk';

export interface StakeTimeData {
	time: number;
}

export const stakeTimeSchema = {
	$id: '/stake/time',
	type: 'object',
	required: ['time'],
	properties: {
		time: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
	},
};

export class StakeTimeStore extends Modules.BaseStore<StakeTimeData> {
	public schema = stakeTimeSchema;
}
