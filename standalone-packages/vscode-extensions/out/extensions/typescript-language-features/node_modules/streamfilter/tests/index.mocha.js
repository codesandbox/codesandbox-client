'use strict';

var assert = require('assert');
var Stream = require('stream');
var StreamTest = require('streamtest');
var StreamFilter = require('../src/index');

describe('StreamFilter', function() {

  describe('should fail', function() {

    it('if options.filter is not a function', function() {
      assert.throws(function() {
        new StreamFilter();
      });
    }, /Error/);

  });

  describe('should work', function() {

    it('should work without new', function() {
      var createFilter = StreamFilter;

      assert(createFilter(function() {}) instanceof StreamFilter);
    });

  });

  // Iterating through versions
  StreamTest.versions.forEach(function(version) {

    describe('for ' + version + ' streams', function() {

      describe('in object mode', function() {

        describe('should work', function() {
          var object1 = { test: 'plop' };
          var object2 = { test: 'plop2' };
          var object3 = { test: 'plop3' };

          it('with no restore option', function(done) {
            var inputStream = StreamTest[version].fromObjects([object1, object2]);
            var filter = new StreamFilter(function(obj, unused, cb) {
              if(obj === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.deepEqual(objs, [object1]);
              done();
            });

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore option', function(done) {
            var inputStream = StreamTest[version].fromObjects([object1, object2]);
            var filter = new StreamFilter(function(obj, unused, cb) {
              if(obj === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.deepEqual(objs, [object1]);
              filter.restore.pipe(StreamTest[version].toObjects(function(err2, objs2) {
                if(err2) {
                  return done(err2);
                }
                assert.deepEqual(objs2, [object2]);
                done();
              }));
            });

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore option and more than 16 nested objects', function(done) {
            var nDone = 0;
            var inputStream = StreamTest[version].fromObjects([
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
              object1, object2, object1, object2, object1, object2, object1, object2,
            ]);
            var filter = new StreamFilter(function(obj, unused, cb) {
              if(obj === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 32);
              if(2 === ++nDone) {
                done();
              }
            });

            filter.restore.pipe(StreamTest[version].toObjects(function(err2, objs2) {
              if(err2) {
                return done(err2);
              }
              assert.equal(objs2.length, 32);
              if(2 === ++nDone) {
                done();
              }
            }));

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore option and more than 16 objects', function(done) {
            var nDone = 0;
            var inputStream = StreamTest[version].fromObjects([
              object1, object1, object1, object1, object1, object1, object1, object1,
              object1, object1, object1, object1, object1, object1, object1, object1,
              object1, object1, object1, object1, object1, object1, object1, object1,
              object2, object2, object2, object2, object2, object2, object2, object2,
              object2, object2, object2, object2, object2, object2, object2, object2,
              object2, object2, object2, object2, object2, object2, object2, object2,
            ]);
            var filter = new StreamFilter(function(obj, unused, cb) {
              if(obj === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 24);
              if(2 === ++nDone) {
                done();
              }
            });

            filter.restore.pipe(StreamTest[version].toObjects(function(err2, objs2) {
              if(err2) {
                return done(err2);
              }
              assert.equal(objs2.length, 24);
              if(2 === ++nDone) {
                done();
              }
            }));

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore and passthrough option in a different pipeline', function(done) {
            var inputStream = StreamTest[version].fromObjects([object1, object2]);
            var filter = new StreamFilter(function(obj, unused, cb) {
              if(obj === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
              passthrough: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.deepEqual(objs, [object1]);
              filter.restore.pipe(StreamTest[version].toObjects(function(err2, objs2) {
                if(err2) {
                  return done(err2);
                }
                assert.deepEqual(objs2, [object3, object2]);
                done();
              }));
            });
            var restoreInputStream = StreamTest[version].fromObjects([object3]);

            inputStream.pipe(filter).pipe(outputStream);
            restoreInputStream.pipe(filter.restore);
          });

          it('with restore and passthrough option in the same pipeline', function(done) {
            var passThroughStream1Ended = false;
            var passThroughStream2Ended = false;
            var duplexStreamEnded = false;
            var inputStream = StreamTest[version].fromObjects([object1, object2, object3]);
            var filter = new StreamFilter(function(chunk, encoding, cb) {
              if(chunk === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
              passthrough: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.deepEqual(objs, [object1, object2, object3]);
              setImmediate(done);
            });
            var duplexStream = new Stream.Duplex({ objectMode: true });

            duplexStream._write = function(obj, unused, cb) {
              duplexStream.push(obj);
              setImmediate(cb);
            };
            duplexStream._read = function() {};
            duplexStream.on('finish', function() {
              setTimeout(function() {
                duplexStream.push(null);
              }, 100);
            });
            outputStream.on('end', function() {
              assert(passThroughStream1Ended,
                'PassThrough stream ends before the output one.');
              assert(passThroughStream2Ended,
                'PassThrough stream ends before the output one.');
              assert(duplexStreamEnded,
                'Duplex stream ends before the output one.');
            });
            filter.restore.on('end', function() {
              assert(passThroughStream1Ended,
                'PassThrough stream ends before the restore one.');
              assert(passThroughStream2Ended,
                'PassThrough stream ends before the restore one.');
              assert(duplexStreamEnded,
                'Duplex stream ends before the restore one.');
            });
            inputStream.pipe(filter)
              .pipe(new Stream.PassThrough({ objectMode: true }))
              .on('end', function() {
                passThroughStream1Ended = true;
              })
              .pipe(new Stream.PassThrough({ objectMode: true }))
              .on('end', function() {
                passThroughStream2Ended = true;
              })
              .pipe(duplexStream)
              .on('end', function() {
                duplexStreamEnded = true;
              })
              .pipe(filter.restore)
              .pipe(outputStream);
          });

          it('with restore and passthrough option in the same pipeline and a buffered stream', function(done) {
            var passThroughStream1Ended = false;
            var passThroughStream2Ended = false;
            var duplexStreamEnded = false;
            var inputStream = StreamTest[version].fromObjects([object1, object2, object3]);
            var filter = new StreamFilter(function(chunk, encoding, cb) {
              if(chunk === object2) {
                return cb(true);
              }
              return cb(false);
            }, {
              objectMode: true,
              restore: true,
              passthrough: true,
            });
            var outputStream = StreamTest[version].toObjects(function(err, objs) {
              if(err) {
                return done(err);
              }
              assert.equal(objs.length, 3);
              setImmediate(done);
            });
            var duplexStream = new Stream.Duplex({ objectMode: true });

            duplexStream._objs = [];
            duplexStream._write = function(obj, unused, cb) {
              duplexStream._objs.push(obj);
              cb();
            };
            duplexStream._read = function() {
              var obj;

              if(duplexStream._hasFinished) {
                while(duplexStream._objs.length) {
                  obj = duplexStream._objs.shift();
                  if(!duplexStream.push(obj)) {
                    break;
                  }
                }
                if(0 === duplexStream._objs.length) {
                  duplexStream.push(null);
                }
              }
            };
            duplexStream.on('finish', function() {
              duplexStream._hasFinished = true;
              duplexStream._read();
            });
            outputStream.on('end', function() {
              assert(passThroughStream1Ended,
                'PassThrough stream ends before the output one.');
              assert(passThroughStream2Ended,
                'PassThrough stream ends before the output one.');
              assert(duplexStreamEnded,
                'Duplex stream ends before the output one.');
            });
            filter.restore.on('end', function() {
              assert(passThroughStream1Ended,
                'PassThrough stream ends before the restore one.');
              assert(passThroughStream2Ended,
                'PassThrough stream ends before the restore one.');
              assert(duplexStreamEnded,
                'Duplex stream ends before the restore one.');
            });
            inputStream.pipe(filter)
              .pipe(new Stream.PassThrough({ objectMode: true }))
              .on('end', function() {
                passThroughStream1Ended = true;
              })
              .pipe(new Stream.PassThrough({ objectMode: true }))
              .on('end', function() {
                passThroughStream2Ended = true;
              })
              .pipe(duplexStream)
              .on('end', function() {
                duplexStreamEnded = true;
              })
              .pipe(filter.restore)
              .pipe(outputStream);
          });

        });

      });

      describe('in buffer mode', function() {

        describe('should work', function() {
          var buffer1 = new Buffer('plop');
          var buffer2 = new Buffer('plop2');
          var buffer3 = new Buffer('plop3');

          it('with no restore option', function(done) {
            var inputStream = StreamTest[version].fromChunks([buffer1, buffer2]);
            var filter = new StreamFilter(function(chunk, encoding, cb) {
              if(chunk.toString() === buffer1.toString()) {
                return cb(true);
              }
              return cb(false);
            });
            var outputStream = StreamTest[version].toText(function(err, text) {
              if(err) {
                return done(err);
              }
              assert.equal(text, buffer2.toString());
              done();
            });

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore option', function(done) {
            var inputStream = StreamTest[version].fromChunks([buffer1, buffer2]);
            var filter = new StreamFilter(function(chunk, encoding, cb) {
              if(chunk.toString() === buffer2.toString()) {
                return cb(true);
              }
              return cb(false);
            }, {
              restore: true,
            });
            var outputStream = StreamTest[version].toText(function(err, text) {
              if(err) {
                return done(err);
              }
              assert.equal(text, buffer1.toString());
              filter.restore.pipe(StreamTest[version].toText(function(err2, text2) {
                if(err2) {
                  return done(err2);
                }
                assert.equal(text2, buffer2.toString());
                done();
              }));
            });

            inputStream.pipe(filter).pipe(outputStream);
          });

          it('with restore and passthrough option', function(done) {
            var inputStream = StreamTest[version].fromChunks([buffer1, buffer2]);
            var filter = new StreamFilter(function(chunk, encoding, cb) {
              if(chunk.toString() === buffer2.toString()) {
                return cb(true);
              }
              return cb(false);
            }, {
              restore: true,
              passthrough: true,
            });
            var outputStream = StreamTest[version].toText(function(err, text) {
              if(err) {
                return done(err);
              }
              assert.equal(text, buffer1.toString());
              filter.restore.pipe(StreamTest[version].toText(function(err2, text2) {
                if(err2) {
                  return done(err2);
                }
                assert.deepEqual(text2, [buffer3.toString(), buffer2.toString()].join(''));
                done();
              }));
            });
            var restoreInputStream = StreamTest[version].fromChunks([buffer3]);

            inputStream.pipe(filter).pipe(outputStream);
            restoreInputStream.pipe(filter.restore);
          });

        });

      });

    });

  });

});
