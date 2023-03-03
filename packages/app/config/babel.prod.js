const TARGETS = ['>0.25%', 'not ie 11', 'not op_mini all'];

module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  cacheDirectory: true,
  cacheCompression: true,
  compact: true,
  presets: [
    require.resolve('@babel/preset-flow'),
    // Latest stable ECMAScript features
    [
      require.resolve('@babel/preset-env'),
      {
        targets: TARGETS,
        // Disable polyfill transforms
        useBuiltIns: false,
        modules: false,
      },
    ],
    // JSX, Flow
    require.resolve('@babel/preset-react'),

    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    require.resolve('@babel/plugin-transform-template-literals'),
    require.resolve('@babel/plugin-transform-destructuring'),
    require.resolve('@babel/plugin-transform-async-to-generator'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-styled-components'),
    require.resolve('babel-plugin-macros'),
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-transform-react-display-name'),
    // Optimization: hoist JSX that never changes out of render()
    // Disabled because of issues:
    // * https://github.com/facebookincubator/create-react-app/issues/525
    // * https://phabricator.babeljs.io/search/query/pCNlnC2xzwzx/
    // TODO: Enable again when these issues are resolved.
    // require.resolve('babel-plugin-transform-react-constant-elements')
  ],
  overrides: [
    {
      test: ['../src/sandbox'],
      presets: [
        require.resolve('@babel/preset-flow'),
        // Latest stable ECMAScript features
        [
          require.resolve('@babel/preset-env'),
          {
            targets: TARGETS,
            // Disable polyfill transforms
            useBuiltIns: false,
            modules: false,
          },
        ],
      ],
    },
  ],
};
