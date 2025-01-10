/* eslint-disable global-require */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const threadLoader = require('thread-loader');
const env = require('@codesandbox/common/lib/config/env');
const getHost = require('@codesandbox/common/lib/utils/host');
const postcssNormalize = require('postcss-normalize');
const WatchMissingNodeModulesPlugin = require('../scripts/utils/WatchMissingNodeModulesPlugin');
const paths = require('./paths');

const babelDev = require('./babel.dev');
const babelProd = require('./babel.prod');

const NODE_ENV = JSON.parse(env.default['process.env.NODE_ENV']);
const SANDBOX_ONLY = !!process.env.SANDBOX_ONLY;
const APP_HOT = Boolean(process.env.APP_HOT);
const __DEV__ = NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle
const __PROD__ = NODE_ENV === 'production'; // eslint-disable-line no-underscore-dangle
const __PROFILING__ = Boolean(process.env.PROFILING); // eslint-disable-line no-underscore-dangle
// const __TEST__ = NODE_ENV === 'test'; // eslint-disable-line no-underscore-dangle
const babelConfig = __DEV__ ? babelDev : babelProd;
const publicPath = SANDBOX_ONLY || __DEV__ ? '/' : getHost.default() + '/';
const isLint = 'LINT' in process.env;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    __DEV__ && require.resolve('style-loader'),
    __PROD__ && {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: __PROD__,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: __PROD__,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

const sepRe = `\\${path.sep}`; // path separator regex

const threadPoolConfig = {
  workers: 2,
};

if (!isLint) {
  threadLoader.warmup(threadPoolConfig, ['babel-loader']);
}

module.exports = {
  entry: SANDBOX_ONLY
    ? {
        sandbox: [
          require.resolve('./polyfills'),
          path.join(paths.sandboxSrc, 'index.ts'),
        ],
        'sandbox-startup': path.join(paths.sandboxSrc, 'startup.ts'),
      }
    : APP_HOT
    ? {
        app: [
          require.resolve('./polyfills'),
          path.join(paths.appSrc, 'index.js'),
        ],
      }
    : {
        app: [
          require.resolve('./polyfills'),
          path.join(paths.appSrc, 'index.js'),
        ],
        sandbox: [
          require.resolve('./polyfills'),
          path.join(paths.sandboxSrc, 'index.ts'),
        ],
        'sandbox-startup': path.join(paths.sandboxSrc, 'startup.ts'),
        'watermark-button': path.join(paths.src, 'watermark-button.js'),
        banner: path.join(paths.src, 'banner.js'),
        embed: [
          require.resolve('./polyfills'),
          path.join(paths.embedSrc, 'index.js'),
        ],
      },
  target: 'web',
  mode: 'development',

  node: {
    setImmediate: false,
    module: 'empty',
    child_process: 'empty',
  },

  output: {
    path: paths.appBuild,
    publicPath,
    globalObject: 'this',
    jsonpFunction: 'csbJsonP', // So we don't conflict with webpack generated libraries in the sandbox
    pathinfo: false,
    futureEmitAssets: true,
  },

  module: {
    rules: [
      // Transpile node dependencies, node deps are often not transpiled for IE11
      {
        test: [
          new RegExp(`${sepRe}node_modules${sepRe}.*ansi-styles`),
          new RegExp(`${sepRe}node_modules${sepRe}.*chalk`),
          new RegExp(`${sepRe}node_modules${sepRe}.*jest`),
          new RegExp(`${sepRe}node_modules${sepRe}.*monaco-textmate`),
          new RegExp(`${sepRe}node_modules${sepRe}.*onigasm`),
          new RegExp(`react-icons`),
          new RegExp(`${sepRe}node_modules${sepRe}.*gsap`),
          new RegExp(`${sepRe}node_modules${sepRe}.*babel-plugin-macros`),
          new RegExp(`sandbox-hooks`),
          new RegExp(`template-icons`),
          new RegExp(`${sepRe}node_modules${sepRe}.*react-devtools-inline`),
          new RegExp(
            `${sepRe}node_modules${sepRe}.*@codesandbox${sepRe}sandpack-react`
          ),
          new RegExp(
            `${sepRe}node_modules${sepRe}vue-template-es2015-compiler`
          ),
          new RegExp(
            `${sepRe}node_modules${sepRe}babel-plugin-transform-vue-jsx`
          ),
        ],
        loader: 'babel-loader',
        query: {
          retainLines: true,
          cacheDirectory: true,
          presets: [
            '@babel/preset-flow',
            [
              '@babel/preset-env',
              {
                targets: ['>0.25%', 'not ie 11', 'not op_mini all'],
                modules: 'umd',
                useBuiltIns: false,
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-transform-template-literals',
            '@babel/plugin-transform-destructuring',
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: `graphql-tag/loader`,
      },
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.worker\.(js|ts)$/i,
        use: [
          {
            loader: 'comlink-loader',
            options: {
              singleton: true,
              multi: true,
              multiple: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: true,
          },
          'sass-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: /\.(j|t)sx?$/,
        include: [paths.src, /@emmetio/],
        exclude: [
          /eslint\.4\.1\.0\.min\.js$/,
          /typescriptServices\.js$/,
          /\.no-webpack\./,
        ],
        use: [
          !isLint
            ? {
                loader: 'thread-loader',
                options: threadPoolConfig,
              }
            : false,
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
        ].filter(Boolean),
      },

      // mjs support
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },

      // `eslint` has some dynamic `require(...)`.
      // Delete those.
      {
        test: new RegExp(`eslint${sepRe}lib${sepRe}(?:linter|rules)\\.js$`),
        loader: 'string-replace-loader',
        options: {
          search: '(?:\\|\\||(\\())\\s*require\\(.+?\\)',
          replace: '$1',
          flags: 'g',
        },
      },
      // Patch for `babel-eslint`
      {
        test: new RegExp(`babel-eslint${sepRe}lib${sepRe}index\\.js$`),
        loader: 'string-replace-loader',
        options: {
          search: '[\\s\\S]+', // whole file.
          replace:
            'module.exports.parseForESLint = require("./parse-with-scope")',
          flags: 'g',
        },
      },
      // Remove dynamic require in jest circus
      {
        test: /format_node_assert_errors\.js/,
        loader: 'string-replace-loader',
        options: {
          search: `assert = require.call(null, 'assert');`,
          replace: `throw new Error('module assert not found')`,
        },
      },
      // Remove dynamic require in jest circus
      {
        test: /babel-plugin-macros/,
        loader: 'string-replace-loader',
        options: {
          search: `_require(`,
          replace: `self.require(`,
        },
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
        }),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      // For importing README.md
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          { loader: 'svgo-loader' },
        ],
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        exclude: [/\/favicon.ico$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [paths.src],
        loader: 'file-loader',
        options: {
          name: 'favicon.ico?[hash:8]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // https://github.com/gaearon/react-hot-loader/issues/1311
      {
        test: /\.js$/,
        include: /node_modules\/react-dom/,
        use: ['react-hot-loader/webpack'],
      },
    ],

    noParse: [
      /eslint\.4\.1\.0\.min\.js$/,
      /typescriptServices\.js$/,
      /browserfs\.js/,
      /browserfs\.min\.js/,
      /standalone-packages\/codesandbox-browserfs/,
      /standalone-packages\/vscode\//,
      /fontfaceobserver\.standalone\.js/,
    ],
  },

  externals: ['jsdom', 'prettier', 'cosmiconfig'],

  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    modules: [
      'node_modules',
      path.resolve(__dirname, '../src'),
      'standalone-packages',
    ],

    extensions: ['.js', '.json', '.ts', '.tsx'],

    alias: {
      moment: 'moment/moment.js',
      path: 'path-browserify',

      fs: 'codesandbox-browserfs/dist/shims/fs.js',
      buffer: 'codesandbox-browserfs/dist/shims/buffer.js',
      processGlobal: 'codesandbox-browserfs/dist/shims/process.js',
      bufferGlobal: 'codesandbox-browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve(
        path.join(
          '..',
          '..',
          '..',
          'standalone-packages',
          'codesandbox-browserfs',
          'build',
          __DEV__ ? 'browserfs.js' : 'browserfs.min.js'
        )
      ),

      ...(__PROFILING__
        ? {
            'react-dom$': 'react-dom/profiling',
            'scheduler/tracing': 'scheduler/tracing-profiling',
          }
        : {}),
    },
  },

  plugins: [
    ...(SANDBOX_ONLY
      ? [
          new HtmlWebpackPlugin({
            inject: true,
            chunks: ['sandbox-startup', 'vendors~sandbox', 'sandbox'],
            filename: 'index.html',
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
              minifyURLs: true,
            },
          }),
          new ScriptExtHtmlWebpackPlugin({
            custom: {
              test: 'sandbox',
              attribute: 'crossorigin',
              value: 'anonymous',
            },
          }),
        ]
      : [
          // Generates an `index.html` file with the <script> injected.
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__ ? ['common-sandbox', 'common', 'app'] : ['app'],
            chunksSortMode: 'manual',
            filename: 'app.html',
            template: paths.appHtml,
            minify: __PROD__ && {
              removeComments: false,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__
              ? [
                  'sandbox-startup',
                  'common-sandbox',
                  'vendors~sandbox',
                  'sandbox',
                ]
              : ['sandbox-startup', 'sandbox'],
            chunksSortMode: 'manual',
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
              minifyURLs: true,
            },
          }),
          new ScriptExtHtmlWebpackPlugin({
            custom: {
              test: 'sandbox',
              attribute: 'crossorigin',
              value: 'anonymous',
            },
          }),
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__
              ? ['common-sandbox', 'common', 'embed']
              : ['embed'],
            chunksSortMode: 'manual',
            filename: 'embed.html',
            template: path.join(paths.embedSrc, 'index.html'),
            minify: __PROD__ && {
              removeComments: false,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
        ]),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
    new webpack.DefinePlugin(env.default),

    new webpack.DefinePlugin({ __DEV__ }),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),

    // With this plugin we override the load-rules of eslint, this function prevents
    // us from using eslint in the browser, therefore we need to stop it!
    !SANDBOX_ONLY &&
      new webpack.NormalModuleReplacementPlugin(
        new RegExp(['eslint', 'lib', 'load-rules'].join(sepRe)),
        path.join(paths.config, 'stubs/load-rules.compiled.js')
      ),

    // DON'T TOUCH THIS. There's a bug in Webpack 4 that causes bundle splitting
    // to break when using lru-cache. So we literally gice them our own version
    new webpack.NormalModuleReplacementPlugin(
      /^lru-cache$/,
      path.join(paths.config, 'stubs/lru-cache.js')
    ),

    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),

    __PROD__ &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
  ].filter(Boolean),
};
