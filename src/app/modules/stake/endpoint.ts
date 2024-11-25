import { Modules, Types } from 'klayr-sdk';
import { StakeMethod } from './method';

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
}
