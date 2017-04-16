module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in OS temporary directory for faster rebuilds.
  cacheDirectory: true,
  presets: [
    // Latest stable ECMAScript features
    ['es2015', { modules: false }],
    // JSX, Flow
    'react',
  ],
  plugins: [
    require.resolve('babel-plugin-transform-async-to-generator'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-runtime'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('babel-plugin-syntax-dynamic-import'),
    [
      require.resolve('react-loadable/babel'),
      {
        server: true,
        webpack: true,
      },
    ],
    require.resolve('react-hot-loader/babel'),
  ],
};
