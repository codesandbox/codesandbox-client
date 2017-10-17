const merge = require('webpack-merge');
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const childProcess = require('child_process');
const commonConfig = require('./webpack.common');

const publicPath = '/';

const COMMIT_COUNT = childProcess
  .execSync('git rev-list --count HEAD')
  .toString();

const COMMIT_HASH = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString();
const VERSION = `${COMMIT_COUNT}-${COMMIT_HASH}`;

module.exports = merge(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    sourceMapFilename: '[file].map', // Default
  },
  plugins: [
    new webpack.DefinePlugin({ VERSION: JSON.stringify(VERSION) }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: true,
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      cacheId: 'code-sandbox',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: publicPath + 'app.html',
      navigateFallbackWhitelist: [/\/s\//],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 5242880,
      runtimeCaching: [
        {
          urlPattern: /api\/v1\/sandboxes/,
          handler: 'networkFirst',
          options: {
            cache: {
              maxEntries: 50,
              name: 'sandboxes-cache',
            },
          },
        },
        {
          urlPattern: /^https:\/\/unpkg\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'unpkg-cache',
            },
          },
        },
        {
          urlPattern: /cloudflare\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 20,
              name: 'cloudflare-cache',
            },
          },
        },
      ],
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'sandbox-service-worker.js',
      cacheId: 'code-sandbox-sandbox',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: 'https://new.codesandbox.io/frame.html',
      staticFileGlobs: ['www/frame.html'],
      stripPrefix: 'www/',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 10485760,
      runtimeCaching: [
        {
          urlPattern: /api\/v1\/sandboxes/,
          handler: 'networkFirst',
          options: {
            cache: {
              maxEntries: 50,
              name: 'sandboxes-cache',
            },
          },
        },
        {
          // These should be dynamic, since it's not loaded from this domain
          // But from the root domain
          urlPattern: /codesandbox\.io\/static\/js\/(vendor|common|sandbox)/,
          handler: 'networkFirst',
          options: {
            cache: {
              name: 'static-root-cache',
            },
          },
        },
        {
          urlPattern: /\.amazonaws\.com\/prod\/package/,
          handler: 'fastest',
          options: {
            cache: {
              // a week
              maxAgeSeconds: 60 * 60 * 24 * 7,
              name: 'dependency-url-generator-cache',
            },
          },
        },
        {
          urlPattern: /webpack-dll-prod\.herokuapp\.com/,
          handler: 'fastest',
          options: {
            cache: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
              name: 'packager-cache',
            },
          },
        },
        {
          urlPattern: /https:\/\/d1jyvh0kxilfa7\.cloudfront\.net/,
          handler: 'fastest',
          options: {
            cache: {
              maxEntries: 200,
              name: 'dependency-files-cache',
            },
          },
        },
        {
          urlPattern: /^https:\/\/unpkg\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'unpkg-dep-cache',
            },
          },
        },
        {
          urlPattern: /cloudflare\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              name: 'cloudflare-cache',
            },
          },
        },
      ],
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.IgnorePlugin(/\/src\/node_modules/),
  ],
});
