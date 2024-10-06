/* eslint-disable @typescript-eslint/no-empty-function */
// import { ChainConnectorPlugin } from '@klayr/chain-connector-plugin';
import { Application } from 'klayr-sdk';
import { DripPlugin } from './plugins/drip/drip_plugin';

export const registerPlugins = (app: Application): void => {
	// app.registerPlugin(new ChainConnectorPlugin());
	app.registerPlugin(new DripPlugin());
};
