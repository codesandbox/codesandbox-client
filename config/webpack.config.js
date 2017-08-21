const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const childProcess = require('child_process');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const WatchMissingNodeModulesPlugin = require('../scripts/utils/WatchMissingNodeModulesPlugin');
const env = require('./env');

const babelDev = require('./babel.dev');
const babelProd = require('./babel.prod');

const NODE_ENV = JSON.parse(env['process.env.NODE_ENV']);
const __DEV__ = NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle
const __PROD__ = NODE_ENV === 'production'; // eslint-disable-line no-underscore-dangle
const babelConfig = __DEV__ ? babelDev : babelProd;

const COMMIT_COUNT = childProcess
  .execSync('git rev-list --count HEAD')
  .toString();

const COMMIT_HASH = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString();
const VERSION = `${COMMIT_COUNT}-${COMMIT_HASH}`;

const publicPath = __PROD__ ? '/' : '/';

const getOutput = () =>
  __DEV__
    ? {
        path: paths.appBuild,
        pathinfo: true,
        filename: 'static/js/[name].js',
        publicPath
      }
    : {
        path: paths.appBuild,
        pathinfo: true,
        filename: 'static/js/[name].[chunkhash].js',
        chunkFilename: 'static/js/[name].[chunkhash].chunk.js',
        sourceMapFilename: '[file].map', // Default
        publicPath
      };

const config = {
  devtool: __DEV__ ? 'eval' : 'source-map',

  entry: {
    app: [require.resolve('./polyfills'), path.join(paths.appSrc, 'index.js')],
    sandbox: [
      require.resolve('babel-polyfill'),
      require.resolve('./polyfills'),
      path.join(paths.sandboxSrc, 'index.js')
    ],
    embed: [
      require.resolve('./polyfills'),
      path.join(paths.embedSrc, 'index.js')
    ],
    vendor: ['react', 'react-dom', 'styled-components']
  },

  target: 'web',

  node: {
    fs: 'empty',
    module: 'empty',
    child_process: 'empty'
  },

  output: getOutput(),

  module: {
    rules: [
      {
        test: /create-zip\/.*\/files\/.*\.ico$/,
        loader: 'base64-loader'
      },
      {
        test: /create-zip\/.*\/files\/.*$/,
        exclude: [/create-zip\/.*\/files\/.*\.ico$/],
        loader: 'raw-loader'
      },
      {
        test: /\.js$/,
        include: paths.src,
        exclude: [
          /eslint\.4\.1\.0\.min\.js$/,
          /typescriptServices\.js$/,
          // Don't do the node modules of the codesandbox module itself
          /codesandbox\/node_modules/,
          /create-zip\/.*\/files\/.*$/
        ],
        loader: 'happypack/loader'
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: [/create-zip\/.*\/files\/.*$/]
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        exclude: [/create-zip\/.*\/files\/.*$/]
      },
      // For importing README.md
      {
        test: /\.md$/,
        loader: 'raw-loader',
        exclude: [/create-zip\/.*\/files\/.*$/]
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: [/\/favicon.ico$/, /create-zip\/.*\/files\/.*$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [paths.src],
        exclude: [/create-zip\/.*\/files\/.*$/],
        loader: 'file-loader',
        options: {
          name: 'favicon.ico?[hash:8]'
        }
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [/create-zip\/.*\/files\/.*$/],
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "html" loader is used to process template page (index.html) to resolve
      // resources linked with <link href="./relative/path"> HTML tags.
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: [/create-zip\/.*\/files\/.*$/],
        options: {
          attrs: ['link:href']
        }
      }
    ],

    noParse: [/eslint\.4\.1\.0\.min\.js$/, /typescriptServices\.js$/]
  },

  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    modules: ['src', 'node_modules'],

    extensions: ['.js', '.json'],

    alias: {
      moment: 'moment/moment.js'
    }
  },

  plugins: [
    new HappyPack({
      loaders: [
        {
          path: 'babel-loader',
          query: babelConfig
        }
      ]
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'common', 'app'],
      filename: 'app.html',
      template: paths.appHtml,
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'common', 'sandbox'],
      filename: 'frame.html',
      template: paths.sandboxHtml,
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'embed'],
      filename: 'embed.html',
      template: path.join(paths.embedSrc, 'index.html'),
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({ VERSION: JSON.stringify(VERSION) }),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Make the monaco editor work
    new CopyWebpackPlugin([
      {
        from: __DEV__
          ? 'node_modules/monaco-editor/dev/vs'
          : 'node_modules/monaco-editor/min/vs',
        to: 'public/vs'
      },
      {
        from: 'static',
        to: 'static'
      },
      {
        from: 'src/homepage/static',
        to: 'static'
      }
    ]),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'sandbox']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2
    }),
    new webpack.NamedModulesPlugin()
  ]
};

if (__DEV__) {
  const devEntries = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?/',
    'webpack/hot/only-dev-server'
  ];

  config.entry.app = [...devEntries, ...config.entry.app];
  config.entry.embed = [...devEntries, ...config.entry.embed];
}

if (__PROD__) {
  config.plugins = [
    ...config.plugins,
    // Minify the code.
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
        warnings: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      },
      sourceMap: true
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
              name: 'sandboxes-cache'
            }
          }
        },
        {
          urlPattern: /^https:\/\/unpkg\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 300,
              name: 'unpkg-cache'
            }
          }
        },
        {
          urlPattern: /cloudflare\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 20,
              name: 'cloudflare-cache'
            }
          }
        }
      ]
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
      cacheId: 'code-sandbox-sandbox',
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
              name: 'sandboxes-cache'
            }
          }
        },
        {
          // These should be dynamic, since it's not loaded from this domain
          // But from the root domain
          urlPattern: /codesandbox\.io\/static\/js\/(vendor|common|sandbox)/,
          handler: 'networkFirst',
          options: {
            cache: {
              name: 'static-root-cache'
            }
          }
        },
        {
          urlPattern: /api\/v1\/sandboxes/,
          handler: 'networkFirst',
          options: {
            cache: {
              maxEntries: 50,
              name: 'sandboxes-cache'
            }
          }
        },
        {
          urlPattern: /\.amazonaws\.com\/prod\/package/,
          handler: 'fastest',
          options: {
            cache: {
              // a week
              maxAgeSeconds: 60 * 60 * 24 * 7,
              name: 'dependency-url-generator-cache'
            }
          }
        },
        {
          urlPattern: /webpack-dll-prod\.herokuapp\.com/,
          handler: 'fastest',
          options: {
            cache: {
              maxEntries: 100,
              name: 'packager-cache'
            }
          }
        },
        {
          urlPattern: /https:\/\/d3i2v4dxqvxaq9\.cloudfront\.net/,
          handler: 'fastest',
          options: {
            cache: {
              maxEntries: 200,
              name: 'dependency-files-cache'
            }
          }
        },
        {
          urlPattern: /cloudflare\.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              name: 'cloudflare-cache'
            }
          }
        }
      ]
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin()
  ];
} else {
  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin()
  ];
}

module.exports = config;
