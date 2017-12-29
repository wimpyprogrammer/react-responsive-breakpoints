const commonConfig = require('./karma-common.conf');

const localConfig = commonConfig;

module.exports = config => config.set(localConfig);
