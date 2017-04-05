const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const childProcess = require('child_process');
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

const getOutput = () => __DEV__
  ? {
      path: paths.appBuild,
      pathinfo: true,
      filename: 'static/js/[name].js',
      publicPath: '/',
    }
  : {
      path: paths.appBuild,
      pathinfo: true,
      filename: 'static/js/[name].[hash:8].js',
      chunkFilename: 'static/js/[name].[hash:8].chunk.js',
      sourceMapFilename: '[file].map', // Default
      publicPath: 'https://codesandbox.io/',
    };

const config = {
  devtool: __DEV__ ? 'eval' : 'source-map',

  entry: {
    app: [require.resolve('./polyfills'), path.join(paths.appSrc, 'index.js')],
    sandbox: [
      require.resolve('./polyfills'),
      path.join(paths.sandboxSrc, 'index.js'),
    ],
    vendor: ['babel-standalone', 'codemirror', 'react', 'styled-components'],
  },

  target: 'web',

  output: getOutput(),

  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.src,
        exclude: [/eslint\.js$/],
        loader: 'babel-loader',
        options: babelConfig,
      },
      // Used to remove strict mode from eval:
      {
        test: /eval\/js\.js$/,
        include: paths.src,
        loader: 'babel-loader?cacheDirectory',
        options: (() => {
          const altererdConfig = Object.assign({}, babelConfig);

          altererdConfig.plugins.push(
            require.resolve('babel-plugin-transform-remove-strict-mode')
          );
          return altererdConfig;
        })(),
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
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
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
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
      // "html" loader is used to process template page (index.html) to resolve
      // resources linked with <link href="./relative/path"> HTML tags.
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: ['link:href'],
        },
      },
    ],
  },
  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    modules: ['src', 'node_modules'],

    extensions: ['.js', '.json'],

    alias: {
      moment: 'moment/moment.js',
    },
  },

  plugins: [
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
        minifyURLs: true,
      },
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
        minifyURLs: true,
      },
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
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'sandbox'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.NamedModulesPlugin(),
  ],
};

if (__DEV__) {
  const devEntries = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?/',
    'webpack/hot/only-dev-server',
  ];

  config.entry.app = [...devEntries, ...config.entry.app];
}

if (__PROD__) {
  config.plugins = [
    ...config.plugins,
    // Minify the code.
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new BabiliPlugin(),
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
        join_vars: true,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
  ];
} else {
  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ];
}

module.exports = config;
