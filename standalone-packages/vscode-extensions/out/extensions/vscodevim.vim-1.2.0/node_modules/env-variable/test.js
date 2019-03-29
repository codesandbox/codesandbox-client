const assume = require('assume');
const env = require('./');

describe('env-variable', function () {
  it('merges with process.env as we are running on node', function () {
    process.env.TESTING_ENVS = 'wat';

    const data = env();
    assume(data.TESTING_ENVS).equals('wat');
    assume(data.foo).is.a('undefined');

    const merged = env({ foo: 'bar' });

    assume(merged.TESTING_ENVS).equals('wat');
    assume(merged.foo).equals('bar');
  });

  it('lowercases keys', function () {
    process.env.UPPERCASE = 'does NOT touch VALUES';

    const data = env({ FOO: 'bar' });

    assume(data.UPPERCASE).equals('does NOT touch VALUES');
    assume(data.uppercase).equals('does NOT touch VALUES');
    assume(data.FOO).equals('bar');
    assume(data.foo).equals('bar');
  });

  describe('#merge', function () {
    it('merges objects', function () {
      const data = {};

      env.merge(data, { foo: 'bar' });
      assume(data).deep.equals({ foo: 'bar' });
    });
  });

  describe('#parse', function () {
    it('parses basic query strings', function () {
      const data = env.parse('foo=bar');

      assume(data).is.a('object');
      assume(data).deep.equals({ foo: 'bar' });
    });
  });
});
