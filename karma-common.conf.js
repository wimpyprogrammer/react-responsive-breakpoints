module.exports = (
	{
		frameworks: ['mocha', 'viewport'],

		files: [
			'test-setup.js',
		],

		preprocessors: {
			'test-setup.js': ['webpack'],
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
					sinon$: `${__dirname}/node_modules/sinon/lib/sinon.js`,
				},
			},

			module: {
				rules: [
					{
						test: /\.js$/,
						include: [
							`${__dirname}/src/`,
						],
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
