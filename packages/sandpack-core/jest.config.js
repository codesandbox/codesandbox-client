module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transformIgnorePatterns: ['/node_modules/(?!lodash-es).+\\.js$'],
  modulePathIgnorePatterns: ['lib'],
};
