const AssetsPlugin = require('assets-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const paths = require('./paths');

module.exports = config => {
  const isProd = config.mode === 'production';
  const shared = {
    plugins: [
      new AssetsPlugin({
        filename: 'assets.json',
        path: 'www',
        keepInMemory: true,
        entrypoints: true,
      }),
    ],
  };

  return [
    merge(config, shared),
    merge(
      {
        ...config,
        plugins: [],
        entry: {
          'sandpack-service-worker': path.join(
            paths.sandboxSrc,
            'sandpack/service-worker.ts'
          ),
        },
        output: {
          ...config.output,
          filename: isProd ? '[name].[contenthash:9].js' : '[name].[hash].js',
          chunkFilename: isProd
            ? '[name].[contenthash:9].chunk.js'
            : '[name].[hash].chunk.js',
        },
      },
      shared
    ),
  ];
};
