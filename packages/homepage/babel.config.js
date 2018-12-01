module.exports = {
  presets: [
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
};
