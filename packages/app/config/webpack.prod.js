/* eslint-disable global-require */

// const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { normalizeName } = require('webpack/lib/optimize/SplitChunksPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VERSION = require('@codesandbox/common/lib/version').default;
// const childProcess = require('child_process');
const commonConfig = require('./webpack.common');

const publicPath = '/';
// const isMaster =
//   childProcess
//     .execSync(`git branch | grep \\* | cut -d ' ' -f2`)
//     .toString()
//     .trim() === 'master';

const normalize = normalizeName({ name: true, automaticNameDelimiter: '~' });

module.exports = merge(commonConfig, {
  devtool: 'source-map',
  output: {
    filename: 'static/js/[name].[contenthash:9].js',
    chunkFilename: 'static/js/[name].[contenthash:9].chunk.js',
  },
  mode: 'production',
  stats: 'verbose',
  // optimization: {
  //   minimize: false,
  // },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          output: {
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: 2,
        cache: true,
        sourceMap: true,
      }),
    ],
    concatenateModules: true, // ModuleConcatenationPlugin
    chunkIds: 'named',
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
    process.env.ANALYZE &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    new webpack.DefinePlugin({ VERSION: JSON.stringify(VERSION) }),
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
        // eslint-disable-next-line no-console
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: publicPath + 'app.html',
      navigateFallbackWhitelist: [/\/s\//],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [
        /\.map$/,
        /vscode/,
        /\/vs/,
        /asset-manifest\.json$/,
      ],
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 20, // 20mb

      runtimeCaching: [
        // Don't add this runtime cache as this causes us to give back *old*
        // API responses, this will lead people to believe that they lost work
        // when they can't connect to our servers.
        // {
        //   urlPattern: /api\/v1\/sandboxes/,
        //   handler: 'networkFirst',
        //   options: {
        //     cache: {
        //       maxEntries: 50,
        //       name: 'sandboxes-cache',
        //     },
        //   },
        // },
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
        {
          urlPattern: /\/vscode33/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maximumFileSizeToCacheInBytes: 1024 * 1024 * 100, // 100mb
              name: 'vscode',
            },
          },
        },
        {
          urlPattern: /vscode-extensions\//,
          handler: 'cacheFirst',
          options: {
            cache: {
              maximumFileSizeToCacheInBytes: 1024 * 1024 * 100, // 100mb
              name: 'vscode-extensions',
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
        // eslint-disable-next-line no-console
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: 'https://new.codesandbox.io/frame.html',
      staticFileGlobs: process.env.SANDBOX_ONLY
        ? ['www/index.html']
        : ['www/frame.html'],
      stripPrefix: 'www/',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 20, // 20mb
      runtimeCaching: [
        // Don't do this, because it will cache API responses to the server. Even if no-cache headers
        // are set.
        // {
        //   urlPattern: /api\/v1\//,
        //   handler: 'networkFirst',
        //   options: {
        //     cache: {
        //       maxEntries: 50,
        //       name: 'sandboxes-cache',
        //     },
        //   },
        // },
        {
          urlPattern: /api\/v1\/dependencies/,
          handler: 'cacheFirst',
          options: {
            cache: {
              // A day
              maxAgeSeconds: 60 * 60 * 24,
              name: 'dependency-version-cache',
            },
          },
        },
        {
          // These should be dynamic, since it's not loaded from this domain
          // But from the root domain
          urlPattern: /codesandbox\.io\/static\/js\//,
          handler: 'cacheFirst',
          options: {
            cache: {
              // A day
              maxAgeSeconds: 60 * 60 * 24,
              name: 'static-root-cache',
            },
          },
        },
        {
          urlPattern: /\.amazonaws\.com\/prod\/package/,
          handler: 'cacheFirst',
          options: {
            cache: {
              // a week
              maxAgeSeconds: 60 * 60 * 24 * 7,
              name: 'dependency-url-generator-cache',
            },
          },
        },
        {
          urlPattern: /prod-packager-packages\.codesandbox\.io/,
          handler: 'cacheFirst',
          options: {
            cache: {
              // a week
              maxAgeSeconds: 60 * 60 * 24 * 7,
              name: 'dependency-files-cache',
            },
          },
        },
        // We resolve `package.json` to resolve versions (e.g. next -> 15.0.5). We need to have a much shorter cache on this
        {
          urlPattern: /^https:\/\/unpkg\.com\/.*\/package.json/,
          handler: 'networkFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'unpkg-dep-pkg-cache',
              maxAgeSeconds: 60 * 5, // 5 minutes
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
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: /^https:\/\/cdn\.rawgit\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'rawgit-cache',
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: /jsdelivr\.(com|net)/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'jsdelivr-dep-cache',
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: /cloudflare\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 50,
              name: 'cloudflare-cache',
              maxAgeSeconds: 60 * 60 * 24 * 7,
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
    new ManifestPlugin({
      fileName: 'file-manifest.json',
      publicPath: commonConfig.output.publicPath,

      map: fileDescriptor => {
        const { name } = fileDescriptor;

        // Removes the ".[contenthash]" part from name
        return merge(fileDescriptor, {
          name: name.replace(/(\.[a-f0-9]+)(\.[a-z]{2,})$/, '$2'),
        });
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../sse-hooks/dist/sse-hooks.js',
          to: 'public/sse-hooks/[name].[contenthash].[ext]',
        },
      ],
    }),
    // isMaster &&
    //   new SentryWebpackPlugin({
    //     include: 'src',
    //     ignore: ['node_modules', 'webpack.config.js'],
    //     release: VERSION,
    //   }),
  ].filter(Boolean),
});
