module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transformIgnorePatterns: ['/node_modules/(?!lodash-es).+\\.js$'],
  modulePathIgnorePatterns: ['lib', 'fixture'],
  moduleNameMapper: {
    'hack-node-fetch': 'node-fetch',
    'node-fetch': 'fetch-vcr',
  },
  setupFiles: ['<rootDir>/setupTests.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
