'use strict';

const assume = require('assume');
const { format } = require('logform');
const stream = require('stream');
const TransportStream = require('../');
const Parent = require('./fixtures/parent');
const { testLevels, testOrder } = require('./fixtures');
const {
  infosFor,
  logFor,
  levelAndMessage,
  toException,
  toWriteReq
} = require('abstract-winston-transport/utils');

const { LEVEL, MESSAGE } = require('triple-beam');

describe('TransportStream', () => {
  it('should have the appropriate methods defined', () => {
    const transport = new TransportStream();
    assume(transport).instanceof(stream.Writable);
    assume(transport._write).is.a('function');
    // eslint-disable-next-line no-undefined
    assume(transport.log).equals(undefined);
  });

  it('should accept a custom log function invoked on _write', () => {
    const log = logFor(1);
    const transport = new TransportStream({ log });
    assume(transport.log).equals(log);
  });

  it('should invoke a custom log function on _write', done => {
    const info = {
      [LEVEL]: 'test',
      level: 'test',
      message: 'Testing ... 1 2 3.'
    };

    const transport = new TransportStream({
      log(actual) {
        assume(actual).equals(info);
        done();
      }
    });

    transport.write(info);
  });

  describe('_write(info, enc, callback)', () => {
    it('should log to any level when { level: undefined }', done => {
      const expected = testOrder.map(levelAndMessage);
      const transport = new TransportStream({
        log: logFor(testOrder.length, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(expected.length);
          assume(infos).deep.equals(expected);
          done();
        })
      });

      expected.forEach(transport.write.bind(transport));
    });

    it('should not log when no info object is provided', done => {
      const expected = testOrder.map(levelAndMessage).map((info, i) => {
        if (testOrder.length > (i + 1)) {
          info.private = true;
        }

        return info;
      });
      const transport = new TransportStream({
        format: format(info => {
          if (info.private) {
            return false;
          }

          return info;
        })(),
        log: logFor(1, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(1);
          assume(infos.pop()).deep.equals(expected.pop());
          done();
        })
      });

      expected.forEach(transport.write.bind(transport));
    });

    it('should only log messages BELOW the level priority', done => {
      const expected = testOrder.map(levelAndMessage);
      const transport = new TransportStream({
        level: 'info',
        log: logFor(5, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(5);
          assume(infos).deep.equals(expected.slice(0, 5));
          done();
        })
      });

      transport.levels = testLevels;
      expected.forEach(transport.write.bind(transport));
    });

    it('{ level } should be ignored when { handleExceptions: true }', () => {
      const expected = testOrder.map(levelAndMessage).map(info => {
        info.exception = true;
        return info;
      });

      const transport = new TransportStream({
        level: 'info',
        log: logFor(testOrder.length, (err, infos) => {
          // eslint-disable-next-line no-undefined
          assume(err).equals(undefined);
          assume(infos.length).equals(expected.length);
          assume(infos).deep.equals(expected);
        })
      });

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

        const transport = new TransportStream({
          log(info) {
            // eslint-disable-next-line no-undefined
            assume(info.exception).equals(undefined);
            done();
          }
        });

        expected.forEach(transport.write.bind(transport));
      });

      it('should invoke log when { handleExceptions: true }', done => {
        const actual = [];
        const expected = [{
          exception: true, [LEVEL]: 'error',
          level: 'error',
          message: 'Test exception handling'
        }, {
          [LEVEL]: 'test',
          level: 'test',
          message: 'Testing ... 1 2 3.'
        }];

        const transport = new TransportStream({
          handleExceptions: true,
          log(info, next) {
            actual.push(info);
            if (actual.length === expected.length) {
              assume(actual).deep.equals(expected);
              return done();
            }

            next();
          }
        });

        expected.forEach(transport.write.bind(transport));
      });
    });
  });

  describe('_writev(chunks, callback)', () => {
    it('invokes .log() for each of the valid chunks when necessary in streams plumbing', done => {
      const expected = infosFor({
        count: 50,
        levels: testOrder
      });
      const transport = new TransportStream({
        log: logFor(50 * testOrder.length, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(expected.length);
          assume(infos).deep.equals(expected);
          done();
        })
      });

      //
      // Make the standard _write throw to ensure that _writev is called.
      //
      transport._write = () => {
        throw new Error('TransportStream.prototype._write should never be called.');
      };

      transport.cork();
      expected.forEach(transport.write.bind(transport));
      transport.uncork();
    });

    it('should not log when no info object is provided in streams plumbing', done => {
      const expected = testOrder.map(levelAndMessage).map((info, i) => {
        if (testOrder.length > (i + 1)) {
          info.private = true;
        }

        return info;
      });
      const transport = new TransportStream({
        format: format(info => {
          if (info.private) {
            return false;
          }

          return info;
        })(),
        log: logFor(1, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(1);
          assume(infos.pop()).deep.equals(expected.pop());
          done();
        })
      });

      //
      // Make the standard _write throw to ensure that _writev is called.
      //
      transport._write = () => {
        throw new Error('TransportStream.prototype._write should never be called.');
      };

      transport.cork();
      expected.forEach(transport.write.bind(transport));
      transport.uncork();
    });


    it('ensures a format is applied to each info when no .logv is defined', done => {
      const expected = infosFor({ count: 10, levels: testOrder });
      const transport = new TransportStream({
        format: format.json(),
        log: logFor(10 * testOrder.length, (err, infos) => {
          if (err) {
            return done(err);
          }

          assume(infos.length).equals(expected.length);
          infos.forEach((info, i) => {
            assume(info[MESSAGE]).equals(JSON.stringify(expected[i]));
          });

          done();
        })
      });

      //
      // Make the standard _write throw to ensure that _writev is called.
      //
      transport._write = () => {
        throw new Error('TransportStream.prototype._write should never be called.');
      };

      transport.cork();
      expected.forEach(transport.write.bind(transport));
      transport.uncork();
    });

    it('invokes .logv with all valid chunks when necessary in streams plumbing', done => {
      const expected = infosFor({
        count: 50,
        levels: testOrder
      });
      const transport = new TransportStream({
        level: 'info',
        log() {
          throw new Error('.log() should never be called');
        },
        logv(chunks, callback) {
          assume(chunks.length).equals(250);
          callback(); // eslint-disable-line callback-return
          done();
        }
      });

      //
      // Make the standard _write throw to ensure that _writev is called.
      //
      transport._write = () => {
        throw new Error('TransportStream.prototype._write should never be called.');
      };

      transport.cork();
      transport.levels = testLevels;
      expected.forEach(transport.write.bind(transport));
      transport.uncork();
    });
  });

  describe('parent (i.e. "logger") ["pipe", "unpipe"]', () => {
    it('should define { level, levels } on "pipe"', done => {
      const parent = new Parent({
        level: 'info',
        levels: testLevels
      });
      const transport = new TransportStream({
        log() {}
      });

      parent.pipe(transport);
      setImmediate(() => {
        assume(transport.level).equals('info');
        assume(transport.levels).equals(testLevels);
        assume(transport.parent).equals(parent);
        done();
      });
    });

    it('should not overwrite existing { level } on "pipe"', done => {
      const parent = new Parent({
        level: 'info',
        levels: testLevels
      });
      const transport = new TransportStream({
        level: 'error',
        log() {}
      });

      parent.pipe(transport);
      setImmediate(() => {
        assume(transport.level).equals('error');
        assume(transport.levels).equals(testLevels);
        assume(transport.parent).equals(parent);
        done();
      });
    });

    it('should unset parent on "unpipe"', done => {
      const parent = new Parent({
        level: 'info',
        levels: testLevels
      });
      const transport = new TransportStream({
        level: 'error',
        log() {}
      });

      //
      // Trigger "pipe" first so that transport.parent is set.
      //
      parent.pipe(transport);
      setImmediate(() => {
        assume(transport.parent).equals(parent);

        //
        // Now verify that after "unpipe" it is set to 'null'.
        //
        parent.unpipe(transport);
        setImmediate(() => {
          assume(transport.parent).equals(null);
          done();
        });
      });
    });

    it('should invoke a close method on "unpipe"', done => {
      const parent = new Parent({
        level: 'info',
        levels: testLevels
      });
      const transport = new TransportStream({
        log() {}
      });

      //
      // Test will only successfully complete when `close`
      // is invoked
      //
      transport.close = () => {
        assume(transport.parent).equals(null);
        done();
      };

      //
      // Trigger "pipe" first so that transport.parent is set.
      //
      parent.pipe(transport);
      setImmediate(() => {
        assume(transport.parent).equals(parent);
        parent.unpipe(transport);
      });
    });
  });

  describe('_accept(info)', function () {
    it('should filter only log messages BELOW the level priority', () => {
      const expected = testOrder
        .map(levelAndMessage)
        .map(toWriteReq);

      const transport = new TransportStream({
        level: 'info'
      });
      transport.levels = testLevels;
      const filtered = expected.filter(transport._accept, transport)
        .map(write => write.chunk.level);

      assume(filtered).deep.equals([
        'error',
        'warn',
        'dog',
        'cat',
        'info'
      ]);
    });

    it('should filter out { exception: true } when { handleExceptions: false }', () => {
      const expected = testOrder
        .map(toException)
        .map(toWriteReq);

      const transport = new TransportStream({
        handleExceptions: false,
        level: 'info'
      });
      transport.levels = testLevels;
      const filtered = expected.filter(transport._accept, transport)
        .map(info => info.level);

      assume(filtered).deep.equals([]);
    });

    it('should include ALL { exception: true } when { handleExceptions: true }', () => {
      const expected = testOrder
        .map(toException)
        .map(toWriteReq);

      const transport = new TransportStream({
        handleExceptions: true,
        level: 'info'
      });
      transport.levels = testLevels;
      const filtered = expected.filter(transport._accept, transport)
        .map(write => write.chunk.level);

      assume(filtered).deep.equals(testOrder);
    });
  });

  describe('{ format }', function () {
    it('logs the output of the provided format', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };
      const transport = new TransportStream({
        format: format.json(),
        log(info) {
          assume(info[MESSAGE]).equals(JSON.stringify(expected));
          done();
        }
      });

      transport.write(expected);
    });

    it('treats the original object immutable', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };
      const transport = new TransportStream({
        format: format.json(),
        log(info) {
          assume(info).not.equals(expected);
          done();
        }
      });

      transport.write(expected);
    });
  });

  describe('{ silent }', () => {
    const silentTransport = new TransportStream({
      silent: true,
      format: format.json(),
      log() {
        assume(false).true('.log() was called improperly');
      }
    });

    it('{ silent: true } ._write() never calls `.log`', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };

      silentTransport.write(expected);
      setImmediate(() => done());
    });

    it('{ silent: true } ._writev() never calls `.log`', done => {
      const expected = {
        [LEVEL]: 'info',
        level: 'info',
        message: 'there will be json'
      };

      silentTransport.cork();
      for (let i = 0; i < 15; i++) {
        silentTransport.write(expected);
      }

      silentTransport.uncork();
      setImmediate(() => done());
    });

    it('{ silent: true } ensures ._accept(write) always returns false', () => {
      const accepted = silentTransport._accept({
        chunk: {}
      });
      assume(accepted).false();
    });
  });
});
