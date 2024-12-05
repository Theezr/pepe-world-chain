export enum BusinessType {
	LemonadeStand = 'lemonadeStand',
	CoffeeShop = 'coffeeShop',
	PizzaParlor = 'pizzaParlor',
	BurgerJoint = 'burgerJoint',
	SushiBar = 'sushiBar',
}

export enum WorkerType {
	ScuffedPimp = 'scuffedPimp',
	NormiePimp = 'normiePimp',
	// HipsterPimp = 'hipsterPimp',
}

export const workerData = {
	[WorkerType.ScuffedPimp]: {
		baseCost: 0,
		growthRate: 0.2,
		typeMultiplier: 1.0,
		baseExperience: 100,
		multiplierGrowthRate: 0.05,
		collectionID: Buffer.from('10000000', 'hex'),
		module: 'worker',
		attributes: {
			name: 'Scuffed Pimp',
			type: WorkerType.ScuffedPimp,
			imageUrl: '/assets/pepe-scuffed-pimp.jpg',
			level: 1,
			revMultiplier: 1,
			capMultiplier: 1,
		},
	},
	[WorkerType.NormiePimp]: {
		baseCost: 1_000,
		growthRate: 0.4,
		typeMultiplier: 1.5,
		baseExperience: 100,
		multiplierGrowthRate: 0.1,
		collectionID: Buffer.from('20000000', 'hex'),
		module: 'worker',
		attributes: {
			name: 'Normie Pimp',
			type: WorkerType.NormiePimp,
			imageUrl: '/assets/pepe-hipster-pimp.jpg',
			level: 1,
			revMultiplier: 1.5,
			capMultiplier: 1.5,
		},
	},
};

export const businessData = {
	[BusinessType.LemonadeStand]: {
		baseCost: 100,
		growthRate: 0.2,
		typeMultiplier: 1.0,
		baseRevenue: 1,
		maxRevenue: 4_000,
		collectionID: Buffer.from('00000001', 'hex'),
		module: 'business',
		attributes: {
			name: 'Lemonade Stand',
			type: BusinessType.LemonadeStand,
			imageUrl: '/assets/pepe-lemonade.jpg',
			quantity: 1,
		},
	},
	[BusinessType.CoffeeShop]: {
		baseCost: 1_000,
		growthRate: 0.25,
		typeMultiplier: 1.2,
		baseRevenue: 3,
		maxRevenue: 20_000,
		collectionID: Buffer.from('00000002', 'hex'),
		module: 'business',
		attributes: {
			name: 'Coffee Shop',
			type: BusinessType.CoffeeShop,
			imageUrl: '/assets/pepe-coffeeshop.jpg',
			quantity: 1,
		},
	},
	[BusinessType.PizzaParlor]: {
		baseCost: 20_000,
		growthRate: 0.35,
		typeMultiplier: 1.5,
		baseRevenue: 7,
		maxRevenue: 35_000,
		collectionID: Buffer.from('00000003', 'hex'),
		module: 'business',
		attributes: {
			name: 'Pizza Parlor',
			type: BusinessType.PizzaParlor,
			imageUrl: '/assets/pepe-pizzaparlor.jpg',
			quantity: 1,
		},
	},
	[BusinessType.BurgerJoint]: {
		baseCost: 100_000,
		growthRate: 0.5,
		typeMultiplier: 1.8,
		baseRevenue: 12,
		maxRevenue: 50_000,
		collectionID: Buffer.from('00000004', 'hex'),
		module: 'business',
		attributes: {
			name: 'Burger Joint',
			type: BusinessType.BurgerJoint,
			imageUrl: '/assets/pepe-burgerjoint.jpg',
			quantity: 1,
		},
	},
	[BusinessType.SushiBar]: {
		baseCost: 200_000,
		growthRate: 0.8,
		typeMultiplier: 2.5,
		baseRevenue: 20,
		maxRevenue: 125_000,
		collectionID: Buffer.from('00000005', 'hex'),
		module: 'business',
		attributes: {
			name: 'Sushi Bar',
			type: BusinessType.SushiBar,
			imageUrl: '/assets/pepe-sushibar.jpg',
			quantity: 1,
		},
	},
};
