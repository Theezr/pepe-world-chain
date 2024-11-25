import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';
import { Modules } from 'klayr-sdk';
import { StakeTimeStore } from './stores/stakeTime';
import {
	CommandExecuteContext,
	ImmutableMethodContext,
} from 'klayr-framework/dist-node/state_machine';

const stakeRewardToken = '0137133700000000';

export class StakeMethod extends Modules.BaseMethod {
	private _nftMethod!: NFTMethod;
	private _tokenMethod!: Modules.Token.TokenMethod;

	public addDependencies(args: { tokenMethod: Modules.Token.TokenMethod; nftMethod: NFTMethod }) {
		this._nftMethod = args.nftMethod;
		this._tokenMethod = args.tokenMethod;
	}

	public async getStakeRewardsForNft(
		ctx: ImmutableMethodContext,
		nftID: Buffer,
		currentTime: number,
	): Promise<number> {
		const stakeTimeStore = this.stores.get(StakeTimeStore);
		const stakeTime = await stakeTimeStore.get(ctx, nftID);
		if (!stakeTime) return 0;

		const timeDiff = currentTime - stakeTime.time;

		const nft = await this._nftMethod.getNFT(ctx, nftID);
		const attributes = JSON.parse(nft.attributesArray[0].attributes.toString());

		const pepeRewardPerSec = attributes.pepeRewardPerSec;

		console.log(nft);
		console.log(stakeTime);
		console.log({ currentTime });
		console.log({ timeDiff });
		console.log({ pepeRewardPerSec });

		return timeDiff * pepeRewardPerSec;
	}

	public async mintRewardsToUser(
		ctx: CommandExecuteContext<any>,
		nftID: Buffer,
		currentTime: number,
		userAddress: Buffer,
	): Promise<void> {
		const rewards = await this.getStakeRewardsForNft(ctx, nftID, currentTime);

		await this._tokenMethod.initializeUserAccount(
			ctx,
			userAddress,
			Buffer.from(stakeRewardToken, 'hex'),
		);

		await this._tokenMethod.mint(
			ctx,
			userAddress,
			Buffer.from(stakeRewardToken, 'hex'),
			BigInt(rewards),
		);

		console.log(`minted ${rewards}`);
	}
}
