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

			mode: 'development',

			resolve: {
				alias: {
					'react/addons': `${__dirname}/node_modules/react/dist/react-with-addons.js`,
				},
			},

			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
						},
					},
				],
			},

			devtool: 'eval-source-map',

		},

		webpackMiddleware: {
			noInfo: true,
		},
	}
);
