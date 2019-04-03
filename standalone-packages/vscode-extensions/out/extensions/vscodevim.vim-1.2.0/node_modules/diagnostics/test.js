describe('diagnostics', function () {
  'use strict';

  var assume = require('assume')
    , debug = require('./');

  beforeEach(function () {
    process.env.DEBUG = '';
    process.env.DIAGNOSTICS = '';
  });

  it('is exposed as function', function () {
    assume(debug).to.be.a('function');
  });

  it('stringifies objects', function (next) {
    process.env.DEBUG = 'test';

    debug.to({
      write: function write(line) {
        assume(line).to.contain('test');
        assume(line).to.contain('I will be readable { json: 1 }');

        debug.to(process.stdout);
        next();
      }
    });

    debug('test')('I will be readable', { json: 1 });
  });

  describe('.to', function () {
    it('globally overrides the stream', function (next) {
      process.env.DEBUG = 'foo';

      debug.to({
        write: function write(line) {
          assume(line).to.contain('foo');
          assume(line).to.contain('bar');

          debug.to(process.stdout);
          next();
        }
      });

      var log = debug('foo');
      log('bar');
    });
  });
});
