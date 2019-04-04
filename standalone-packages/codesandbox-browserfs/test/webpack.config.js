'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const outDir = path.join(__dirname, '..', 'build', 'temp', 'tests', 'webpack');

const outDirComponents = outDir.split(path.sep);
// i = 1: Skip '..' component.
for (let i = 1; i < outDirComponents.length; i++) {
  const dir = outDirComponents.slice(0, i + 1).join(path.sep);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
fs.writeFileSync(path.join(outDir, 'BFSBuffer.js'), 'module.exports = require(\'buffer\').Buffer;\n');

module.exports = {
  devtool: 'source-map',
  entry: {
    './harness/test': require.resolve('../build/temp/tests/rollup/test.rollup.js'),
    './harness/factories/workerfs_worker': require.resolve('../build/temp/tests/rollup/test_worker.rollup.js')
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    // Use our versions of Node modules.
    alias: {
      'buffer': path.posix.resolve(__dirname, '..', 'node_modules', 'buffer', 'index.js'),
      'path': require.resolve('bfs-path'),
      'process': require.resolve('bfs-process'),
      'BFSBuffer': require.resolve('../build/temp/tests/webpack/BFSBuffer.js')
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/^fs$/),
    new webpack.ProvidePlugin({ process: 'process', Buffer: 'BFSBuffer' }),
    new webpack.NormalModuleReplacementPlugin(/tests\/emscripten/, function(requireReq) {
      // Ignore source-map-loader requests.
      const req = requireReq.request;
      if (req.indexOf('!') === -1) {
        requireReq.request = path.resolve(__dirname, 'tests', 'emscripten', path.basename(req));
      }
    })
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
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      }
    ]
  }
};
