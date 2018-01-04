/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
require('babel-register');

module.exports = require('./karma-local.conf.babel').default;
