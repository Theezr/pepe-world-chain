import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules } from 'klayr-sdk';
import { StakeTimeStore } from './stores/stakeTime';
import {
	CommandExecuteContext,
	ImmutableMethodContext,
} from 'klayr-framework/dist-node/state_machine';
import { NftAttributes, nftData } from './types';

const stakeRewardToken = Buffer.from('0137133700000000', 'hex');

export class StakeMethod extends Modules.BaseMethod {
	private _nftMethod!: NFTMethod;
	private _tokenMethod!: Modules.Token.TokenMethod;

	public addDependencies(args: { tokenMethod: Modules.Token.TokenMethod; nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
		this._tokenMethod = args.tokenMethod;
	}

	public calculateCost(nftAttributes: NftAttributes): number {
		const { baseCost, growthRate, typeMultiplier } = nftData[nftAttributes.type];
		const { quantity } = nftAttributes;
		const cost = baseCost * Math.pow(1 + growthRate, quantity - 1) * typeMultiplier;
		return Math.round(cost);
	}

	public calculateRevenue(nftAttributes: NftAttributes): number {
		const { baseRevenue, maxRevenue } = nftData[nftAttributes.type];
		const { quantity, multiplier = 1 } = nftAttributes;
		const revenue = baseRevenue * quantity * multiplier;
		const cappedRevenue = Math.min(revenue, maxRevenue * multiplier);
		return Math.round(cappedRevenue);
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

		const revenue = this.calculateRevenue(attributes);
		console.log({ revenue, timeDiff });

		return timeDiff * revenue;
	}

	public async mintRewardsToUser(
		ctx: CommandExecuteContext<any>,
		nftID: Buffer,
		currentTime: number,
		userAddress: Buffer,
	): Promise<void> {
		const rewards = await this.getStakeRewardsForNft(ctx, nftID, currentTime);

		await this._tokenMethod.initializeUserAccount(ctx, userAddress, stakeRewardToken);

		await this._tokenMethod.mint(ctx, userAddress, stakeRewardToken, BigInt(rewards));

		console.log(`minted ${rewards}`);
	}
}
