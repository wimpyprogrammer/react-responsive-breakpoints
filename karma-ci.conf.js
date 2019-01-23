/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
require('@babel/register');

module.exports = require('./karma-ci.conf.babel').default;
