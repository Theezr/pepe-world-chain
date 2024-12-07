export interface BusinessAttributes {
	name: string;
	imageUrl: string;
	type: string;
	quantity: number;
	multiplier?: number;
}

export interface GetBusinessData {
	attributes: BusinessAttributes;
	maxRevenue: number;
	baseRevenue: number;
	baseCost: number;
	typeMultiplier: number;
}

export interface WorkerAttributes {
	name: string;
	imageUrl: string;
	type: string;
	level: number;
	revMultiplier: number;
	capMultiplier: number;
}

export interface GetWorkerData {
	attributes: WorkerAttributes;
	baseCost: number;
	growthRate: number;
	typeMultiplier: number;
	multiplierGrowthRate: number;
	baseExperience: number;
	totalExperience?: number;
	experienceToNextLevel?: number;
}
