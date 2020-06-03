module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in OS temporary directory for faster rebuilds.
  cacheDirectory: true,
  cacheCompression: false,
  compact: false,
  presets: [
    // Latest stable ECMAScript features
    require.resolve('@babel/preset-flow'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: 'last 1 chrome versions',
          // We currently minify with uglify
          // Remove after https://github.com/mishoo/UglifyJS2/issues/448
        },
        // Disable polyfill transforms
        useBuiltIns: false,
        modules: false,
      },
    ],
    // JSX, Flow
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
  ].filter(Boolean),
  plugins: [
    require.resolve('react-hot-loader/babel'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('babel-plugin-styled-components'),
    require.resolve('babel-plugin-macros'),
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-transform-react-display-name'),
  ],
};
