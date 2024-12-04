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
	PizzaParlor = 'pizzaParlor',
	BurgerJoint = 'burgerJoint',
	SushiBar = 'sushiBar',
}
export const nftData = {
	[NftType.LemonadeStand]: {
		baseCost: 100,
		growthRate: 0.2,
		typeMultiplier: 1.0,
		baseRevenue: 1,
		maxRevenue: 1_000,
		collectionID: Buffer.from('00000001', 'hex'),
		module: 'business',
		attributes: {
			name: 'Lemonade Stand',
			type: NftType.LemonadeStand,
			imageUrl: '/assets/pepe-lemonade.jpg',
			quantity: 1,
		},
	},
	[NftType.CoffeeShop]: {
		baseCost: 1_000,
		growthRate: 0.25,
		typeMultiplier: 1.2,
		baseRevenue: 3,
		maxRevenue: 7_000,
		collectionID: Buffer.from('00000002', 'hex'),
		module: 'business',
		attributes: {
			name: 'Coffee Shop',
			type: NftType.CoffeeShop,
			imageUrl: '/assets/pepe-coffeeshop.jpg',
			quantity: 1,
		},
	},
	[NftType.PizzaParlor]: {
		baseCost: 4_000,
		growthRate: 0.35,
		typeMultiplier: 1.5,
		baseRevenue: 7,
		maxRevenue: 10_000,
		collectionID: Buffer.from('00000003', 'hex'),
		module: 'business',
		attributes: {
			name: 'Pizza Parlor',
			type: NftType.PizzaParlor,
			imageUrl: '/assets/pepe-pizzaparlor.jpg',
			quantity: 1,
		},
	},
	[NftType.BurgerJoint]: {
		baseCost: 10_000,
		growthRate: 0.5,
		typeMultiplier: 1.8,
		baseRevenue: 12,
		maxRevenue: 15_000,
		collectionID: Buffer.from('00000004', 'hex'),
		module: 'business',
		attributes: {
			name: 'Burger Joint',
			type: NftType.BurgerJoint,
			imageUrl: '/assets/pepe-burgerjoint.jpg',
			quantity: 1,
		},
	},
	[NftType.SushiBar]: {
		baseCost: 20_000,
		growthRate: 0.8,
		typeMultiplier: 2.5,
		baseRevenue: 20,
		maxRevenue: 20_000,
		collectionID: Buffer.from('00000005', 'hex'),
		module: 'business',
		attributes: {
			name: 'Sushi Bar',
			type: NftType.SushiBar,
			imageUrl: '/assets/pepe-sushibar.jpg',
			quantity: 1,
		},
	},
};
