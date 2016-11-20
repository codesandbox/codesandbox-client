const babelDev = require('../babel.dev');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelDev);
