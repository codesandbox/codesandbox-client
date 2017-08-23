const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

const devEntries = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?/',
  'webpack/hot/only-dev-server'
];

module.exports = merge(commonConfig, {
  devtool: 'eval',
  output: {
    filename: 'static/js/[name].js'
  },
  entry: {
    app: devEntries,
    embed: devEntries
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
