/* eslint-disable @typescript-eslint/no-empty-function */
import { ChainConnectorPlugin } from '@klayr/chain-connector-plugin';
import { Application } from 'klayr-sdk';

export const registerPlugins = (app: Application): void => {
  app.registerPlugin(new ChainConnectorPlugin())
};
