import { Modules, Types } from 'klayr-sdk';
import { StakeMethod } from './method';
import { GetNftData, NftAttributes, nftData, NftType } from './types';

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
		const attributes: NftAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateCost(attributes);
	}

	public async getRevenue(ctx: Types.ModuleEndpointContext): Promise<number> {
		const { nftID } = ctx.params;
		const nft = await this.method.getNft(ctx, Buffer.from(nftID as string, 'hex'));
		const attributes: NftAttributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		return this.method.calculateRevenue(attributes);
	}

	public async getAllNftTypes(_ctx: Types.ModuleEndpointContext): Promise<{
		[key: string]: GetNftData;
	}> {
		const allNftTypes: { [key: string]: GetNftData } = {};

		for (const type in NftType) {
			if (NftType.hasOwnProperty(type)) {
				const nftType = NftType[type as keyof typeof NftType];
				const nftInfo = nftData[nftType];
				const attributes: NftAttributes = JSON.parse(
					this.method.createAttributeArray(nftInfo)[0].attributes.toString(),
				);
				allNftTypes[nftType] = {
					attributes: nftInfo.attributes,
					maxRevenue: nftInfo.maxRevenue,
					baseRevenue: nftInfo.baseRevenue,
					baseCost: this.method.calculateCost(attributes),
				};
			}
		}

		return allNftTypes;
	}
}
