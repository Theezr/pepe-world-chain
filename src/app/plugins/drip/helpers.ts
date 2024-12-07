import { BusinessType, WorkerType } from '../../nftTypes';
export function decodeAttributes(hexString: string) {
	if (!hexString) return {};

	const buffer = Buffer.from(hexString, 'hex');
	const jsonString = buffer.toString('utf8');
	const attributes = JSON.parse(jsonString);
	return attributes;
}

export function wait(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidBusinessType(type: string): boolean {
	return Object.values(BusinessType).includes(type as BusinessType);
}

export function isValidWorkerType(type: string): boolean {
	return Object.values(WorkerType).includes(type as WorkerType);
}
