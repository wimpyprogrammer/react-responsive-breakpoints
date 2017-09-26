module.exports = (config) => {
	config.set({
		frameworks: ['mocha', 'viewport'],

		files: [
			'src/**/*.js',
		],

		preprocessors: {
			'src/**/*.js': ['webpack'],
		},

		reporters: ['mocha', 'coverage'],

		coverageReporter: {

			reporters: [
				{ type: 'lcovonly', subdir: '.' },
				{ type: 'text' },
			],

		},

		webpack: {

			externals: {
				'react/lib/ExecutionEnvironment': true,
				'react/addons': true,
				'react/lib/ReactContext': 'window',
			},

			module: {
				loaders: [
					{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
				],
			},

			devtool: 'eval-source-map',

		},

		webpackMiddleware: {
			noInfo: true,
		},
	});
};
