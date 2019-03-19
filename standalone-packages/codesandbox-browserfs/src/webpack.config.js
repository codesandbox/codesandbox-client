'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const release = process.argv.indexOf('-p') !== -1;
const outDir = path.join(__dirname, '..', 'build', 'temp', 'library', 'webpack');

const outDirComponents = outDir.split(path.sep);
// i = 1: Skip '..' component.
for (let i = 1; i < outDirComponents.length; i++) {
  const dir = outDirComponents.slice(0, i + 1).join(path.sep);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      // Race condition: A parallel invocation of webpack
      // may have already created directory. Check.
      if (!fs.existsSync(dir)) {
        throw e;
      }
    }
  }
}
fs.writeFileSync(path.join(outDir, 'BFSBuffer.js'), 'module.exports = require(\'buffer\').Buffer;\n');

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, '..', 'build', 'temp', 'library', 'rollup', 'browserfs.rollup.js'),
  output: {
    path: __dirname,
    filename: '..' + path.sep + 'build' + path.sep + 'browserfs.' + (release ? 'min.js' : 'js'),
    libraryTarget: 'umd',
    library: 'BrowserFS',
    // Work around https://github.com/webpack/webpack/issues/6642 until
    // https://github.com/webpack/webpack/issues/6525 lands.
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.js', '.json'],
    // Use our versions of Node modules.
    alias: {
      'buffer': path.posix.resolve(__dirname, '..', 'node_modules', 'buffer', 'index.js'),
      'path': require.resolve('bfs-path'),
      'process': require.resolve('bfs-process'),
      'BFSBuffer': require.resolve('../build/temp/library/webpack/BFSBuffer.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({ process: 'process', Buffer: 'BFSBuffer' })
  ],
  node: {
    process: false,
    Buffer: false,
    setImmediate: false
  },
  target: 'web',
  module: {
    rules: [
      // Load source maps for any relevant files.
      {
        test: /(\.js$|\.ts$)/,
        enforce: 'pre',
        loader: 'source-map-loader'
      }
    ]
  }
};
