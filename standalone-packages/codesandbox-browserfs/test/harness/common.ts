// Polyfill for Node's 'common' module that it uses for its unit tests.
export default {
  tmpDir: '/tmp/',
  fixturesDir: '/test/fixtures/files/node',
  // NodeJS uses 'common.error' for test messages, but this is inappropriate.
  // I map it to log, instead.
  error: function () { console.log.apply(console, arguments); }
};
