const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../scripts/utils/WatchMissingNodeModulesPlugin');
const env = require('./env');

module.exports = {
  devtool: 'eval',

  entry: {
    app: [
      require.resolve('./polyfills'),
      path.join(paths.appSrc, 'index.js'),
    ],
    sandbox: [
      require.resolve('./polyfills'),
      path.join(paths.sandboxSrc, 'index.js'),
    ],
  },

  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.src,
        loader: 'babel-loader',
        options: require('./babel.dev'),
      },
      // Used to remove strict mode from eval:
      {
        test: /eval-component\.js$/,
        include: paths.src,
        loader: 'babel-loader',
        options: (() => {
          const config = Object.assign({}, require('./babel.dev'));

          config.plugins.push(require.resolve('babel-plugin-transform-remove-strict-mode'));
          return config;
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
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
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
    modules: [
      'node_modules',
    ],

    extensions: ['.js', '.json'],
  },

  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['app'],
      filename: 'index.html',
      template: paths.appHtml,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['sandbox'],
      filename: 'frame.html',
      template: paths.sandboxHtml,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
    new webpack.DefinePlugin(env),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
  ],
};
