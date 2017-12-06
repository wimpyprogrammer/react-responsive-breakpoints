/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-console */
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

	port: 9876,

	// Don't abort slow-running builds
	// captureTimeout: 0,

	sauceLabs: {
		testName: 'Library Karma Tests',
		public: 'public',
		startConnect: true,

		connectOptions: {
			doctor: false, // replace Karma tests with network diagnostics
			logfile: 'artifacts/sauce_connect.log',
			verbose: true,
			verboseDebugging: true,
			vv: true,
		},
	},

	customLaunchers: browsersToTest,

	browsers: Object.keys(browsersToTest),

	singleRun: true,
});

module.exports = (config) => {
	const { SAUCE_USERNAME, SAUCE_ACCESS_KEY } = process.env;
	if (!SAUCE_USERNAME || !SAUCE_ACCESS_KEY) {
		if (!SAUCE_USERNAME) console.log('Sauce Labs username not set.');
		if (!SAUCE_ACCESS_KEY) console.log('Sauce Labs access key not set.');
		process.exit(1);
	}

	ciConfig.logLevel = config.LOG_DEBUG;

	config.set(ciConfig);
};
