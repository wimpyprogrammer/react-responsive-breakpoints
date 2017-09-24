module.exports = (config) => {
	config.set({
		frameworks: ['mocha', 'viewport'],

		files: [
			'src/**/*.spec.js',
		],

		preprocessors: {
			'src/**/*.spec.js': ['webpack'],
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
	});
};
