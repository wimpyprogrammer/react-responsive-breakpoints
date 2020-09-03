/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-console */
import merge from 'lodash.merge';
import commonConfig from './karma-common.conf';
import { name, version } from './package.json';

const { DEBUG: isDebugMode, TRAVIS: isTravisCi, TRAVIS_JOB_NUMBER } = process.env;

const browsersToTest = {
	sl_win10_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 10',
		version: 'latest',
	},
	sl_win10_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
		platform: 'Windows 10',
		version: 'latest',
	},
	sl_win10_edge15: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
		version: '15.15063',
	},
	sl_win10_edge: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
		version: 'latest-1',
	},
	sl_mac1013_safari: {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'macOS 10.13',
		version: 'latest-1',
	},
};

const ciConfig = merge(commonConfig, {
	reporters: commonConfig.reporters.concat('saucelabs'),

	port: 9876,

	// Don't abort slow-running builds
	captureTimeout: 0,
	browserDisconnectTimeout: 60 * 1000,
	browserDisconnectTolerance: 2,
	browserNoActivityTimeout: 60 * 1000,

	client: {
		mocha: {
			timeout: 20 * 1000,
		},
	},

	sauceLabs: {
		testName: `${name} ${version} ${TRAVIS_JOB_NUMBER}`,
		public: 'public',
		startConnect: !isTravisCi,
		tunnelIdentifier: TRAVIS_JOB_NUMBER,

		connectOptions: {
			// doctor: true, // replace Karma tests with network diagnostics
			logfile: 'artifacts/sauce_connect.log',
			verbose: isDebugMode,
			verboseDebugging: isDebugMode,
			vv: isDebugMode,
		},
	},

	customLaunchers: browsersToTest,

	browsers: Object.keys(browsersToTest),

	singleRun: true,
});

export default (config) => {
	const { SAUCE_USERNAME, SAUCE_ACCESS_KEY } = process.env;
	if (!SAUCE_USERNAME || !SAUCE_ACCESS_KEY) {
		if (!SAUCE_USERNAME) console.log('Sauce Labs username not set.');
		if (!SAUCE_ACCESS_KEY) console.log('Sauce Labs access key not set.');
		process.exit(1);
	}

	ciConfig.logLevel = isDebugMode ? config.LOG_DEBUG : config.LOG_INFO;

	config.set(ciConfig);
};
