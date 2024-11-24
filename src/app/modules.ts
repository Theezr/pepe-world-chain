/* eslint-disable @typescript-eslint/no-empty-function */
import { NFTModule } from 'klayr-framework/dist-node/modules/nft';
import { Application, Modules } from 'klayr-sdk';
import { MintModule } from './modules/mint/module';
import { NftFactoryModule } from './modules/nft_factory/module';
import { StakeModule } from './modules/stake/module';

interface KlayrMethod {
	validator: Modules.Validators.ValidatorsMethod;
	auth: Modules.Auth.AuthMethod;
	token: Modules.Token.TokenMethod;
	fee: Modules.Fee.FeeMethod;
	random: Modules.Random.RandomMethod;
	reward: Modules.DynamicReward.DynamicRewardMethod;
	pos: Modules.PoS.PoSMethod;
	interoperability:
		| Modules.Interoperability.SidechainInteroperabilityMethod
		| Modules.Interoperability.MainchainInteroperabilityMethod;
}

export const registerModules = (app: Application, method: KlayrMethod): void => {
	const mintModule = new MintModule();
	const nftModule = new NFTModule();

	const nftFactoryModule = new NftFactoryModule();
	const stakeModule = new StakeModule();

	mintModule.addDependencies({ tokenMethod: method.token, nftMethod: nftModule.method });
	nftModule.addDependencies(method.interoperability, method.fee, method.token);

	nftFactoryModule.addDependencies({ nftMethod: nftModule.method });
	stakeModule.addDependencies({ nftMethod: nftModule.method });

	app.registerModule(mintModule);
	app.registerModule(nftModule);
	app.registerModule(nftFactoryModule);
	app.registerModule(stakeModule);
};
