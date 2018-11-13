const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const normalizeName = require('webpack/lib/optimize/SplitChunksPlugin')
  .normalizeName;
const ManifestPlugin = require('webpack-manifest-plugin');
const childProcess = require('child_process');
const commonConfig = require('./webpack.common');

const COMMIT_COUNT = childProcess
  .execSync('git rev-list --count HEAD')
  .toString();

const COMMIT_HASH = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString();
const VERSION = `${COMMIT_COUNT}-${COMMIT_HASH}`;

const normalize = normalizeName({ name: true, automaticNameDelimiter: '~' });

module.exports = merge(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    sourceMapFilename: '[file].map', // Default
  },
  mode: 'production',
  stats: 'verbose',

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
    concatenateModules: true, // ModuleConcatenationPlugin
    namedModules: true, // NamedModulesPlugin()
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin

    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 20, // for HTTP2
      maxAsyncRequests: 20, // for HTTP2
      name(module, chunks, cacheGroup) {
        const name = normalize(module, chunks, cacheGroup);

        if (name === 'vendors~app~embed~sandbox') {
          return 'common-sandbox';
        }

        if (name === 'vendors~app~embed') {
          return 'common';
        }
        // generate a chunk name using default strategy...
        return name;
      },
    },
  },

  plugins: [
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({ VERSION: JSON.stringify(VERSION) }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({
      fileName: 'file-manifest.json',
      publicPath: commonConfig.output.publicPath,
    }),
  ].filter(Boolean),
});
