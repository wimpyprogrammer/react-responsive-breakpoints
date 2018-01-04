module.exports = (
	{
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
				{ type: 'html', subdir: '.' },
				{ type: 'text' },
			],

		},

		webpack: {

			resolve: {
				alias: {
					'react/addons': `${__dirname}/node_modules/react/dist/react-with-addons.js`,
				},
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
	}
);
