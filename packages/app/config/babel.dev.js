module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in OS temporary directory for faster rebuilds.
  cacheDirectory: true,
  presets: [
    // Latest stable ECMAScript features
    require.resolve('@babel/preset-flow'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: 67,
          // We currently minify with uglify
          // Remove after https://github.com/mishoo/UglifyJS2/issues/448
        },
        // Disable polyfill transforms
        useBuiltIns: false,
        modules: false,
        forceAllTransforms: true,
      },
    ],
    // JSX, Flow
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-styled-components'),
    require.resolve('babel-plugin-macros'),
    [
      require.resolve('react-loadable/babel'),
      {
        server: true,
        webpack: true,
      },
    ],
  ],
};
