const webpack = require('webpack');
const merge = require('webpack-merge');
// const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const commonConfig = require('./webpack.common');
const setupEntries = require('./setup-entries');

const devEntries = ['webpack-dev-server/client?/'];

const APP_HOT = Boolean(process.env.APP_HOT);
const SANDBOX_ONLY = !!process.env.SANDBOX_ONLY;

const config = merge(
  {
    entry: {
      app: APP_HOT
        ? [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack-hot-middleware/client',
          ]
        : devEntries,
      ...(APP_HOT ? {} : { embed: devEntries }),
    },
  },
  commonConfig,
  {
    devtool: false,
    mode: 'development',
    output: {
      filename: 'static/js/[name].js',
      pathinfo: true,
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    plugins: [
      new WebpackBar(),
      new webpack.EvalSourceMapDevToolPlugin({
        include: /src\/app/,
      }),
      !SANDBOX_ONLY && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
  }
);

module.exports = setupEntries(config);
