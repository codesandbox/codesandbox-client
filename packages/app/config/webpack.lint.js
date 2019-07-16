const config = require('./webpack.common');

// For linting support for importing types
config.resolve.extensions.push('.d.ts');

module.exports = config;
