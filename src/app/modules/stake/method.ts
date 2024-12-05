import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules } from 'klayr-sdk';
import { StakeTimeStore } from './stores/stakeTime';
import {
	CommandExecuteContext,
	CommandVerifyContext,
	ImmutableMethodContext,
} from 'klayr-framework/dist-node/state_machine';
import { BusinessAttributes, WorkerAttributes } from './types';
import { businessData, workerData } from '../../nftTypes';

const stakeRewardToken = Buffer.from('0137133700000000', 'hex');

export class StakeMethod extends Modules.BaseMethod {
	private _nftMethod!: NFTMethod;
	private _tokenMethod!: Modules.Token.TokenMethod;

	public addDependencies(args: { tokenMethod: Modules.Token.TokenMethod; nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
		this._tokenMethod = args.tokenMethod;
	}

	public calculateExperienceToNextLevel(workerAttributes: WorkerAttributes): number {
		const { baseExperience, typeMultiplier, growthRate } = workerData[workerAttributes.type];
		const { level } = workerAttributes;

		const experience = baseExperience * Math.pow(1 + growthRate, level) * typeMultiplier;
		return Math.round(experience);
	}

	public calculateNewMultipliers(workerAttributes: WorkerAttributes): {
		newRevMultiplier: number;
		newCapMultiplier: number;
	} {
		const { multiplierGrowthRate } = workerData[workerAttributes.type];
		const { revMultiplier, capMultiplier, level } = workerAttributes;

		const newRevMultiplier = revMultiplier * Math.pow(1 + multiplierGrowthRate, level);
		const newCapMultiplier = capMultiplier * Math.pow(1 + multiplierGrowthRate, level);

		return {
			newRevMultiplier: Math.round(newRevMultiplier * 100) / 100, // Round to 2 decimal places
			newCapMultiplier: Math.round(newCapMultiplier * 100) / 100, // Round to 2 decimal places
		};
	}

	public calculateCostBusiness(nftAttributes: BusinessAttributes): number {
		const { baseCost, growthRate, typeMultiplier } = businessData[nftAttributes.type];
		const { quantity } = nftAttributes;
		const cost = baseCost * Math.pow(1 + growthRate, quantity - 1) * typeMultiplier;
		return Math.round(cost);
	}

	public calculateCostWorker(nftAttributes: WorkerAttributes): number {
		const { baseCost } = workerData[nftAttributes.type];
		return baseCost;
	}

	public calculateRevenue(nftAttributes: BusinessAttributes): number {
		const { baseRevenue, typeMultiplier } = businessData[nftAttributes.type];
		const { quantity, multiplier = 1 } = nftAttributes;
		const revenue = baseRevenue * quantity * multiplier * typeMultiplier;
		return revenue;
	}

	public getNft(ctx: ImmutableMethodContext, nftID: Buffer) {
		return this._nftMethod.getNFT(ctx, nftID);
	}

	public async getStakeRewardsForNft(
		ctx: ImmutableMethodContext,
		nftID: Buffer,
		currentTime: number,
	): Promise<number> {
		const stakeTimeStore = this.stores.get(StakeTimeStore);
		const stakeTime = await stakeTimeStore.get(ctx, nftID);
		if (stakeTime?.time === 0) return 0;

		const timeDiff = currentTime - stakeTime.time;

		const nft = await this._nftMethod.getNFT(ctx, nftID);
		const attributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		const { multiplier = 1, type, quantity } = attributes;
		const { maxRevenue } = businessData[type];

		const revenue = this.calculateRevenue(attributes);

		const cappedRevenue = Math.min(timeDiff * revenue, maxRevenue * quantity * multiplier);
		return Math.round(cappedRevenue);
	}

	public async mintRewardsToUser(
		ctx: CommandExecuteContext<any>,
		nftID: Buffer,
		currentTime: number,
		userAddress: Buffer,
	): Promise<bigint> {
		const rewards = await this.getStakeRewardsForNft(ctx, nftID, currentTime);

		await this._tokenMethod.initializeUserAccount(ctx, userAddress, stakeRewardToken);
		await this._tokenMethod.mint(ctx, userAddress, stakeRewardToken, BigInt(rewards));

		return BigInt(rewards);
	}

	public async checkForBalanceBusiness(
		ctx: CommandVerifyContext<any>,
		userAddress: Buffer,
		type: string,
	): Promise<boolean> {
		const data = businessData[type];
		const attributes = data.attributes;
		const fee = this.calculateCostBusiness(attributes);
		if (fee === 0) return true;

		const userBalance = await this._tokenMethod.getAvailableBalance(
			ctx,
			userAddress,
			stakeRewardToken,
		);

		return BigInt(userBalance) > BigInt(fee);
	}

	public async checkForBalanceWorker(
		ctx: CommandVerifyContext<any>,
		userAddress: Buffer,
		type: string,
	): Promise<boolean> {
		const data = workerData[type];
		const attributes = data.attributes;
		const fee = this.calculateCostWorker(attributes);
		if (fee === 0) return true;

		const userBalance = await this._tokenMethod.getAvailableBalance(
			ctx,
			userAddress,
			stakeRewardToken,
		);

		return BigInt(userBalance) > BigInt(fee);
	}

	public async burnBusinessFee(
		ctx: CommandExecuteContext<any>,
		userAddress: Buffer,
		attributes: BusinessAttributes,
	): Promise<void> {
		const fee = this.calculateCostBusiness(attributes);
		if (fee === 0) return;

		await this._tokenMethod.initializeUserAccount(ctx, userAddress, stakeRewardToken);
		await this._tokenMethod.burn(ctx, userAddress, stakeRewardToken, BigInt(fee));
	}

	public async burnWorkerFee(
		ctx: CommandExecuteContext<any>,
		userAddress: Buffer,
		attributes: WorkerAttributes,
	): Promise<void> {
		const fee = this.calculateCostWorker(attributes);
		if (fee === 0) return;

		await this._tokenMethod.initializeUserAccount(ctx, userAddress, stakeRewardToken);
		await this._tokenMethod.burn(ctx, userAddress, stakeRewardToken, BigInt(fee));
	}

	public createBusinessAttributes(nftData: any) {
		return [
			{
				module: nftData.module,
				attributes: Buffer.from(
					JSON.stringify({
						name: nftData.attributes.name,
						type: nftData.attributes.type,
						imageUrl: nftData.attributes.imageUrl,
						quantity: nftData.attributes.quantity,
					}),
				),
			},
		];
	}

	public createWorkerAttributes(nftData: any) {
		return [
			{
				module: nftData.module,
				attributes: Buffer.from(
					JSON.stringify({
						name: nftData.attributes.name,
						type: nftData.attributes.type,
						imageUrl: nftData.attributes.imageUrl,
						level: nftData.attributes.level,
						revMultiplier: nftData.attributes.revMultiplier,
						capMultiplier: nftData.attributes.capMultiplier,
					}),
				),
			},
		];
	}
}
