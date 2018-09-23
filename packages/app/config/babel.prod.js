const path = require('path');

module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    require.resolve('@babel/preset-flow'),
    // Latest stable ECMAScript features
    [
      'env',
      {
        targets: {
          ie: 11,
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
    require.resolve('@babel/plugin-transform-async-to-generator'),
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
    // Optimization: hoist JSX that never changes out of render()
    // Disabled because of issues:
    // * https://github.com/facebookincubator/create-react-app/issues/525
    // * https://phabricator.babeljs.io/search/query/pCNlnC2xzwzx/
    // TODO: Enable again when these issues are resolved.
    // require.resolve('babel-plugin-transform-react-constant-elements')
  ],
};
