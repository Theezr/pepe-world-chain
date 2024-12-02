export interface DripPluginConfig {
	port: number;
	host: string;
	encryptedPrivateKey: string;
	tokenID: string;
	applicationUrl: string;
	fee: string;
	amount: string;
	tokenPrefix: string;
}

export interface State {
	publicKey?: Buffer;
	privateKey?: Buffer;
	address?: string;
}
export enum NftType {
	LemonadeStand = 'lemonadeStand',
	CoffeeShop = 'coffeeShop',
}

export const nftData = {
	[NftType.LemonadeStand]: {
		baseCost: 100,
		growthRate: 0.1,
		typeMultiplier: 1.0,
		baseRevenue: 1,
		maxRevenue: 1_000,
	},
	[NftType.CoffeeShop]: {
		baseCost: 500,
		growthRate: 0.15,
		typeMultiplier: 1.5,
		baseRevenue: 5,
		maxRevenue: 5_000,
	},
};
