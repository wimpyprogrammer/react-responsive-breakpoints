/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const merge = require('lodash.merge');
const commonConfig = require('./karma-common.conf');

const browsersToTest = {
	sl_win10_chrome61: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 10',
		version: '61.0',
	},
};

const ciConfig = merge(commonConfig, {
	reporters: ['saucelabs'],

	sauceLabs: {
		testName: 'Library Karma Tests',

		connectOptions: {
			doctor: true,
		},
	},

	customLaunchers: browsersToTest,

	browsers: Object.keys(browsersToTest),

	singleRun: true,
});

module.exports = config => config.set(ciConfig);
