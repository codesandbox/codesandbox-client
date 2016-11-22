const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'index'),
  ],
  module: {
    loaders: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
        query: require('../config/babel.dev'),
      },
    ],
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: path.join(__dirname, 'build'),
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'bundle.js',
    // In development, we always serve from the root. This makes config easier.
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'index.html'),
    }),
  ],
};

