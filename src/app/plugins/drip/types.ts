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
