module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['>0.25%', 'not dead'],
        },
      },
    ],
  ],

  overrides: [
    {
      test: '../common',
      presets: ['@babel/preset-env'],
    },
  ],
};
