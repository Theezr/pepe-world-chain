import { Modules, Types } from 'klayr-sdk';
import { StakeTimeStore } from './stores/stakeTime';
import { NFTMethod } from 'klayr-framework/dist-node/modules/nft';

export class StakeEndpoint extends Modules.BaseEndpoint {
	private _nftMethod!: NFTMethod;

	public addDependencies(nftMethod: NFTMethod) {
		this._nftMethod = nftMethod;
	}

	public async getStakeRewards(ctx: Types.ModuleEndpointContext): Promise<number> {
		const stakeTimeStore = this.stores.get(StakeTimeStore);
		const { nftID } = ctx.params;
		const buffer = Buffer.from(nftID as string, 'hex');

		const stakeTime = await stakeTimeStore.get(ctx, buffer);
		const currentTime = ctx.header.timestamp;
		const timeDiff = currentTime - stakeTime.time;

		const nft = await this._nftMethod.getNFT(ctx, buffer);
		const attributes = JSON.parse(nft.attributesArray[0].attributes.toString());
		console.log(nft);

		const pepeRewardPerSec = attributes.pepeRewardPerSec;
		console.log(stakeTime);
		console.log({ currentTime });
		console.log({ timeDiff });
		console.log({ pepeRewardPerSec });

		return timeDiff * pepeRewardPerSec;
	}
}
