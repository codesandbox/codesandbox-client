module.exports = ({
  config: {
    module: { rules, ...module },
    resolve: { extensions, ...resolve },
    ...config
  },
}) => ({
  ...config,
  module: {
    ...module,
    rules: [
      ...rules,
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require.resolve('babel-preset-react-app')],
            },
          },
        ],
      },
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
      },
    ],
  },
  resolve: {
    ...resolve,
    extensions: [...extensions, '.ts', '.tsx'],
  },
});
