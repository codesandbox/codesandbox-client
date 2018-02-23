import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS();
  if (rootFS.isReadOnly()) {
    return;
  }
  var tmp = common.tmpDir;
  var filename = path.resolve(tmp, 'truncate-file.txt');
  var data = new Buffer(1024 * 16);
  data.fill('x');

  var stat: any;

  // truncateSync
  if (rootFS.supportsSynch()) {
    fs.writeFileSync(filename, data);
    stat = fs.statSync(filename);
    assert.equal(stat.size, 1024 * 16);

    fs.truncateSync(filename, 1024);
    stat = fs.statSync(filename);
    assert.equal(stat.size, 1024);

    fs.truncateSync(filename);
    stat = fs.statSync(filename);
    assert.equal(stat.size, 0);

    // ftruncateSync
    fs.writeFileSync(filename, data);
    var fd = fs.openSync(filename, 'r+');

    stat = fs.statSync(filename);
    assert.equal(stat.size, 1024 * 16);

    // BFS TODO: Support this use case. Currently, we sync on close.
    //fs.ftruncateSync(fd, 1024);
    //stat = fs.statSync(filename);
    //assert.equal(stat.size, 1024);

    //fs.ftruncateSync(fd);
    //stat = fs.statSync(filename);
    //assert.equal(stat.size, 0);

    fs.closeSync(fd);
  }

  function testTruncate(cb: Function) {
    fs.writeFile(filename, data, function(er) {
      if (er) return cb(er);
      fs.stat(filename, function(er, stat) {
        if (er) return cb(er);
        assert.equal(stat.size, 1024 * 16);

        fs.truncate(filename, 1024, function(er) {
          if (er) return cb(er);
          fs.stat(filename, function(er, stat) {
            if (er) return cb(er);
            assert.equal(stat.size, 1024);

            fs.truncate(filename, function(er) {
              if (er) return cb(er);
              fs.stat(filename, function(er, stat) {
                if (er) return cb(er);
                assert.equal(stat.size, 0);
                cb();
              });
            });
          });
        });
      });
    });
  }


  function testFtruncate(cb: Function) {
    fs.writeFile(filename, data, function(er) {
      if (er) return cb(er);
      fs.stat(filename, function(er, stat) {
        if (er) return cb(er);
        assert.equal(stat.size, 1024 * 16);

        fs.open(filename, 'w', function(er, fd) {
          if (er) return cb(er);
          fs.ftruncate(fd, 1024, function(er) {
            if (er) return cb(er);
            // Force a sync.
            fs.fsync(fd, function(er) {
              if (er) return cb(er);
              fs.stat(filename, function(er, stat) {
                if (er) return cb(er);
                assert.equal(stat.size, 1024);

                fs.ftruncate(fd, function(er) {
                  if (er) return cb(er);
                  // Force a sync.
                  fs.fsync(fd, function(er) {
                    if (er) return cb(er);
                    fs.stat(filename, function(er, stat) {
                      if (er) return cb(er);
                      assert.equal(stat.size, 0);
                      (<any> fs).close(fd, cb);
                    });
                  });
                });
              });
            })
          });
        });
      });
    });
  }

  // async tests
  var success = 0;
  testTruncate(function(er: NodeJS.ErrnoException) {
    if (er) throw er;
    success++;
    testFtruncate(function(er: NodeJS.ErrnoException) {
      if (er) throw er;
      success++;
    });
  });

  process.on('exit', function() {
    assert.equal(success, 2, 'Exit code mismatch: ' + success + ' != 2');
  });
};
