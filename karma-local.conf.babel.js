/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import merge from 'lodash.merge';
import commonConfig from './karma-common.conf';

const localConfig = merge({
	autoWatch: true,

	webpackMiddleware: {
		watchOptions: {
			ignored: /node_modules/,
			poll: 500,
		},
	},
}, commonConfig);

export default (config) => config.set(localConfig);
