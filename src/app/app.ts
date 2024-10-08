import { Application, Types } from 'klayr-sdk';
import { registerPlugins } from './plugins';
import { registerModules } from './modules';

export const getApplication = (config: Types.PartialApplicationConfig): Application => {
	const { app, method } = Application.defaultApplication(config);

	registerModules(app, method);
	registerPlugins(app);

	return app;
};
