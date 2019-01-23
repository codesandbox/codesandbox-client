module.exports = {
  presets: ['@babel/preset-flow', 'babel-preset-gatsby'],

  overrides: [
    {
      test: '../common',
      presets: [
        '@babel/preset-env',
        '@babel/preset-flow',
        'babel-preset-gatsby',
      ],
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  ],
};
