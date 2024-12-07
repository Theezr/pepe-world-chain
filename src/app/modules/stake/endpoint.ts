import { Modules, Types } from 'klayr-sdk';
import { StakeMethod } from './method';
import { GetBusinessData, BusinessAttributes, WorkerAttributes, GetWorkerData } from './types';
import { businessData, BusinessType, workerData, WorkerType } from '../../nftTypes';
import { WorkerStakedStore } from './stores/workerStakedStore';

export class StakeEndpoint extends Modules.BaseEndpoint {
	private method!: StakeMethod;

	public addDependencies(method: StakeMethod) {
		this.method = method;
	}

	public async getStakeRewardsForNft(ctx: Types.ModuleEndpointContext): Promise<number> {
		const { nftID } = ctx.params;
		const nftIDBuffer = Buffer.from(nftID as string, 'hex');

		const currentTime = ctx.header.timestamp;

		return this.method.getStakeRewardsForNft(ctx, nftIDBuffer, currentTime);
	}

	public async getUpgradeCost(ctx: Types.ModuleEndpointContext): Promise<number> {
		const { nftID } = ctx.params;
		const nft = await this.method.getNft(ctx, Buffer.from(nftID as string, 'hex'));
		const attributes: BusinessAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateCostBusiness(attributes);
	}

	public async getRevenue(ctx: Types.ModuleEndpointContext): Promise<number> {
		const { nftID } = ctx.params;
		const nft = await this.method.getNft(ctx, Buffer.from(nftID as string, 'hex'));
		const attributes: BusinessAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateRevenue(ctx, nft, attributes);
	}

	public async getExperienceToNextLevel(ctx: Types.ModuleEndpointContext): Promise<string> {
		const { nftID } = ctx.params;
		const nft = await this.method.getNft(ctx, Buffer.from(nftID as string, 'hex'));
		const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateExperienceToNextLevel(attributes).toString();
	}

	public async getNewMultipliers(ctx: Types.ModuleEndpointContext): Promise<{
		newRevMultiplier: number;
		newCapMultiplier: number;
	}> {
		const { nftID } = ctx.params;
		const nft = await this.method.getNft(ctx, Buffer.from(nftID as string, 'hex'));
		const attributes: WorkerAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateNewMultipliers(attributes);
	}

	public async getExperienceStakedWorker(ctx: Types.ModuleEndpointContext): Promise<string> {
		const { address } = ctx.params;
		const workerStakedStore = this.stores.get(WorkerStakedStore);
		try {
			const addressBuffer = Buffer.from(address as string);
			const workerStaked = await workerStakedStore.get(ctx, addressBuffer);

			return workerStaked.experience.toString();
		} catch (error) {
			return '000';
		}
	}

	public async getAllBusinessTypes(_ctx: Types.ModuleEndpointContext): Promise<{
		[key: string]: GetBusinessData;
	}> {
		const allNftTypes: { [key: string]: GetBusinessData } = {};

		for (const type in BusinessType) {
			if (BusinessType.hasOwnProperty(type)) {
				const businessType = BusinessType[type as keyof typeof BusinessType];
				const nftInfo = businessData[businessType];
				const attributes: BusinessAttributes = JSON.parse(
					this.method.createBusinessAttributes(nftInfo)[0].attributes.toString(),
				);
				allNftTypes[businessType] = {
					attributes: nftInfo.attributes,
					maxRevenue: nftInfo.maxRevenue,
					baseRevenue: nftInfo.baseRevenue,
					baseCost: this.method.calculateCostBusiness(attributes),
					typeMultiplier: nftInfo.typeMultiplier,
				};
			}
		}

		return allNftTypes;
	}

	public async getAllWorkerTypes(_ctx: Types.ModuleEndpointContext): Promise<{
		[key: string]: GetWorkerData;
	}> {
		const allWorkerTypes: { [key: string]: GetWorkerData } = {};

		for (const type in WorkerType) {
			if (WorkerType.hasOwnProperty(type)) {
				const workerType = WorkerType[type as keyof typeof WorkerType];
				const workerInfo = workerData[workerType];

				allWorkerTypes[workerType] = {
					attributes: workerInfo.attributes,
					baseCost: workerInfo.baseCost,
					growthRate: workerInfo.growthRate,
					typeMultiplier: workerInfo.typeMultiplier,
					baseExperience: workerInfo.baseExperience,
					multiplierGrowthRate: workerInfo.multiplierGrowthRate,
				};
			}
		}

		return allWorkerTypes;
	}
}
