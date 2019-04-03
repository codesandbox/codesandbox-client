'use strict';

const assume = require('assume');
const stream = require('stream');
const LegacyTransportStream = require('../legacy');
const LegacyTransport = require('./fixtures/legacy-transport');
const { testLevels, testOrder } = require('./fixtures');
const { infosFor, logFor, levelAndMessage } = require('abstract-winston-transport/utils');
const { LEVEL } = require('triple-beam');

//
// Silence the deprecation notice for sanity in test output.
// TODO: Test coverage for the deprecation notice because why not?
//
const deprecated = {
  original: LegacyTransportStream.prototype._deprecated,
  silence() {
    LegacyTransportStream.prototype._deprecated = () => {};
  },
  restore() {
    LegacyTransportStream.prototype._deprecated = this.original;
  }
};

describe('LegacyTransportStream', () => {
  let legacy;
  let transport;

  before(deprecated.silence);
  beforeEach(() => {
    legacy = new LegacyTransport();
    transport = new LegacyTransportStream({
      transport: legacy
    });
  });

  it('should have the appropriate methods defined', () => {
    assume(transport).instanceof(stream.Writable);
    assume(transport._write).is.a('function');
    // eslint-disable-next-line no-undefined
    assume(transport.log).equals(undefined);
  });

  it('should error with no transport', () => {
    assume(() => {
      transport = new LegacyTransportStream();
      assume(transport).instanceof(stream.Writable);
    }).throws(/Invalid transport, must be an object with a log method./);
  });

  it('should error with invalid transport', () => {
    assume(() => {
      transport = new LegacyTransportStream();
      assume(transport).instanceof(stream.Writable);
    }).throws(/Invalid transport, must be an object with a log method./);
  });

  it('should display a deprecation notice', done => {
    deprecated.restore();
    const error = console.error; // eslint-disable-line no-console
    console.error = msg => { // eslint-disable-line no-console
      assume(msg).to.include('is a legacy winston transport. Consider upgrading');
      setImmediate(done);
    };

    legacy = new LegacyTransport();
    transport = new LegacyTransportStream({
      transport: legacy
    });
    console.error = error; // eslint-disable-line no-console
    deprecated.silence();
  });

  it('sets __winstonError on the LegacyTransport instance', function () {
    assume(legacy.__winstonError).is.a('function');
    assume(legacy.listeners('error')).deep.equals([
      legacy.__winstonError
    ]);
  });

  it('emits an error on LegacyTransport error', done => {
    const err = new Error('Pass-through from stream');

    transport.on('error', actual => {
      assume(err).equals(actual);
      done();
    });

    legacy.emit('error', err);
  });

  describe('_write(info, enc, callback)', () => {
    it('should log to any level when { level: undefined }', done => {
      const expected = testOrder.map(levelAndMessage);

      legacy.on('logged', logFor(testOrder.length, (err, infos) => {
        if (err) {
          return done(err);
        }

        assume(infos.length).equals(expected.length);
        assume(infos).deep.equals(expected);
        done();
      }));

      expected.forEach(transport.write.bind(transport));
    });

    it('should only log messages BELOW the level priority', done => {
      const expected = testOrder.map(levelAndMessage);
      transport = new LegacyTransportStream({
        level: 'info',
        transport: legacy
      });

      legacy.on('logged', logFor(5, (err, infos) => {
        if (err) {
          return done(err);
        }

        assume(infos.length).equals(5);
        assume(infos).deep.equals(expected.slice(0, 5));
        done();
      }));

      transport.levels = testLevels;
      expected.forEach(transport.write.bind(transport));
    });

    it('{ level } should be ignored when { handleExceptions: true }', () => {
      const expected = testOrder.map(levelAndMessage).map(info => {
        info.exception = true;
        return info;
      });
      transport = new LegacyTransportStream({
        transport: legacy,
        level: 'info'
      });

      legacy.on('logged', logFor(testOrder.length, (err, infos) => {
        // eslint-disable-next-line no-undefined
        assume(err).equals(undefined);
        assume(infos.length).equals(expected.length);
        assume(infos).deep.equals(expected);
      }));

      transport.levels = testLevels;
      expected.forEach(transport.write.bind(transport));
    });

    describe('when { exception: true } in info', () => {
      it('should not invoke log when { handleExceptions: false }', done => {
        const expected = [{
          exception: true,
          [LEVEL]: 'error',
          level: 'error',
          message: 'Test exception handling'
        }, {
          [LEVEL]: 'test',
          level: 'test',
          message: 'Testing ... 1 2 3.'
        }];

        legacy.on('logged', info => {
          // eslint-disable-next-line no-undefined
          assume(info.exception).equals(undefined);
          done();
        });

        expected.forEach(transport.write.bind(transport));
      });

      it('should invoke log when { handleExceptions: true }', done => {
        const actual = [];
        const expected = [{
          exception: true,
          [LEVEL]: 'error',
          level: 'error',
          message: 'Test exception handling'
        }, {
          [LEVEL]: 'test',
          level: 'test',
          message: 'Testing ... 1 2 3.'
        }];

        transport = new LegacyTransportStream({
          handleExceptions: true,
          transport: legacy
        });

        legacy.on('logged', info => {
          actual.push(info);
          if (actual.length === expected.length) {
            assume(actual).deep.equals(expected);
            return done();
          }
        });

        expected.forEach(transport.write.bind(transport));
      });
    });
  });

  describe('_writev(chunks, callback)', () => {
    it('should be called when necessary in streams plumbing', done => {
      const expected = infosFor({
        count: 50,
        levels: testOrder
      });

      legacy.on('logged', logFor(50 * testOrder.length, (err, infos) => {
        if (err) {
          return done(err);
        }

        assume(infos.length).equals(expected.length);
        assume(infos).deep.equals(expected);
        done();
      }));

      //
      // Make the standard _write throw to ensure that _writev is called.
      //
      transport._write = () => {
        throw new Error('This should never be called');
      };

      transport.cork();
      expected.forEach(transport.write.bind(transport));
      transport.uncork();
    });
  });

  describe('close()', () => {
    it('removes __winstonError from the transport', () => {
      assume(legacy.__winstonError).is.a('function');
      assume(legacy.listenerCount('error')).equal(1);

      transport.close();
      assume(legacy.__winstonError).falsy();
      assume(legacy.listenerCount('error')).equal(0);
    });

    it('invokes .close() on the transport', done => {
      legacy.on('closed:custom', done);
      transport.close();
    });
  });

  describe('{ silent }', () => {
    it('{ silent: true } ._write() never calls `.log`', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };

      legacy.once('logged', () => (
        assume(true).false('"logged" event emitted unexpectedly')
      ));

      transport.silent = true;
      transport.write(expected);
      setImmediate(() => done());
    });

    it('{ silent: true } ._writev() never calls `.log`', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };

      legacy.once('logged', () => (
        assume(true).false('"logged" event emitted unexpectedly')
      ));

      transport.cork();
      for (let i = 0; i < 15; i++) {
        transport.write(expected);
      }

      transport.silent = true;
      transport.uncork();
      setImmediate(() => done());
    });

    it('{ silent: true } ensures ._accept(write) always returns false', () => {
      transport.silent = true;
      const accepted = transport._accept({
        chunk: {}
      });
      assume(accepted).false();
    });
  });

  //
  // Restore the deprecation notice after tests complete.
  //
  after(() => deprecated.restore());
});
