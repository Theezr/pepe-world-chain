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
		collectionID: Buffer.from('00000001', 'hex'),
		module: 'business',
		attributes: {
			name: 'Lemonade Stand',
			type: NftType.LemonadeStand,
			imageUrl: 'https://example.com/image.png',
			quantity: 1,
		},
	},
	[NftType.CoffeeShop]: {
		baseCost: 1_000,
		growthRate: 0.15,
		typeMultiplier: 1.5,
		baseRevenue: 5,
		maxRevenue: 7_000,
		collectionID: Buffer.from('00000002', 'hex'),
		module: 'business',
		attributes: {
			name: 'Coffee Shop',
			type: NftType.CoffeeShop,
			imageUrl: 'https://example.com/image.png',
			quantity: 1,
		},
	},
};
