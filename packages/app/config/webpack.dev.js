const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

const devEntries = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?/',
  'webpack/hot/only-dev-server',
];

module.exports = merge(
  // these go first, because "react-hot-loader/patch" has to be the first entry
  {
    entry: {
      app: devEntries,
      embed: devEntries,
    },
  },
  commonConfig,
  {
    devtool: 'eval',
    output: {
      filename: 'static/js/[name].js',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }
);
