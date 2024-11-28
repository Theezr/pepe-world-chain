import { Modules } from 'klayr-sdk';

export interface BusinessData {
	minted: boolean;
}

export const businessSchema = {
	$id: '/nftFactory/business',
	type: 'object',
	required: ['minted'],
	properties: {
		minted: {
			dataType: 'boolean',
			fieldNumber: 1,
		},
	},
};

export class BusinessStore extends Modules.BaseStore<BusinessData> {
	public schema = businessSchema;
}
