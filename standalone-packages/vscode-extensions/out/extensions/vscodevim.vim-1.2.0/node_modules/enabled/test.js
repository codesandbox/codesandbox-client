describe('enabled', function () {
  'use strict';

  var assume = require('assume')
    , enabled = require('./');

  beforeEach(function () {
    process.env.DEBUG = '';
    process.env.DIAGNOSTICS = '';
  });

  it('uses the `debug` env', function () {
    process.env.DEBUG = 'bigpipe';

    assume(enabled('bigpipe')).to.be.true();
    assume(enabled('false')).to.be.false();
  });

  it('uses the `diagnostics` env', function () {
    process.env.DIAGNOSTICS = 'bigpipe';

    assume(enabled('bigpipe')).to.be.true();
    assume(enabled('false')).to.be.false();
  });

  it('supports wildcards', function () {
    process.env.DEBUG = 'b*';

    assume(enabled('bigpipe')).to.be.true();
    assume(enabled('bro-fist')).to.be.true();
    assume(enabled('ro-fist')).to.be.false();
  });

  it('is disabled by default', function () {
    process.env.DEBUG = '';

    assume(enabled('bigpipe')).to.be.false();

    process.env.DEBUG = 'bigpipe';

    assume(enabled('bigpipe')).to.be.true();
  });

  it('can ignore loggers using a -', function () {
    process.env.DEBUG = 'bigpipe,-primus,sack,-other';

    assume(enabled('bigpipe')).to.be.true();
    assume(enabled('sack')).to.be.true();
    assume(enabled('primus')).to.be.false();
    assume(enabled('other')).to.be.false();
    assume(enabled('unknown')).to.be.false();
  });

  it('supports multiple ranges', function () {
    process.env.DEBUG = 'bigpipe*,primus*';

    assume(enabled('bigpipe:')).to.be.true();
    assume(enabled('bigpipes')).to.be.true();
    assume(enabled('primus:')).to.be.true();
    assume(enabled('primush')).to.be.true();
    assume(enabled('unknown')).to.be.false();
  });
});
