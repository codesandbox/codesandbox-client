import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var got_error = false;
  var success_count = 0;
  var mode_async: number;
  var mode_sync: number;
  var is_windows = process.platform === 'win32';
  var rootFS = fs.getRootFS();

  // BFS: This is only for writable file systems that support properties.
  if (!(rootFS.isReadOnly() || rootFS.supportsProps() === false)) {
    var openCount = 0;

    var open = function() {
      openCount++;
      return (<any>fs)._open.apply(fs, arguments);
    };

    var openSync = function() {
      openCount++;
      return (<any>fs)._openSync.apply(fs, arguments);
    };

    var close = function() {
      openCount--;
      return (<any>fs)._close.apply(fs, arguments);
    };

    var closeSync = function() {
      openCount--;
      return (<any>fs)._closeSync.apply(fs, arguments);
    };

    // Need to hijack fs.open/close to make sure that things
    // get closed once they're opened.
    (<any>fs)._open = fs.open;
    fs.open = open;
    (<any>fs)._close = fs.close;
    fs.close = close;
    if (rootFS.supportsSynch()) {
      (<any>fs)._openSync = fs.openSync;
      fs.openSync = openSync;
      (<any>fs)._closeSync = fs.closeSync;
      fs.closeSync = closeSync;
    }

    // On Windows chmod is only able to manipulate read-only bit
    if (is_windows) {
      mode_async = 0o400;   // read-only
      mode_sync = 0o600;    // read-write
    } else {
      mode_async = 0o777;
      mode_sync = 0o644;
    }

    var file1 = path.join(common.fixturesDir, 'a.js'),
        file2 = path.join(common.fixturesDir, 'a1.js');

    fs.chmod(file1, mode_async.toString(8), function(err) {
      if (err) {
        got_error = true;
      } else {
        if (is_windows) {
          assert.ok((fs.statSync(file1).mode & 0o777) & mode_async);
        } else {
          assert.equal(mode_async, fs.statSync(file1).mode & 0o777);
        }

        fs.chmodSync(file1, mode_sync);
        if (is_windows) {
          assert.ok((fs.statSync(file1).mode & 0o777) & mode_sync);
        } else {
          assert.equal(mode_sync, fs.statSync(file1).mode & 0o777);
        }
        success_count++;
      }
    });

    fs.open(file2, 'a', function(err, fd) {
      if (err) {
        got_error = true;
        console.log(err.stack);
        return;
      }
      fs.fchmod(fd, mode_async.toString(8), function(err) {
        if (err) {
          got_error = true;
        } else {
          if (is_windows) {
            assert.ok((fs.fstatSync(fd).mode & 0o777) & mode_async);
          } else {
            assert.equal(mode_async, fs.fstatSync(fd).mode & 0o777);
          }

          fs.fchmodSync(fd, mode_sync);
          if (is_windows) {
            assert.ok((fs.fstatSync(fd).mode & 0o777) & mode_sync);
          } else {
            assert.equal(mode_sync, fs.fstatSync(fd).mode & 0o777);
          }
          success_count++;
          fs.close(fd);
        }
      });
    });

    // lchmod
    if (rootFS.supportsLinks()) {
      if (fs.lchmod) {
        var link = path.join(common.tmpDir, 'symbolic-link');

        try {
          fs.unlinkSync(link);
        } catch (er) {}
        fs.symlinkSync(file2, link);

        fs.lchmod(link, mode_async, function(err) {
          if (err) {
            got_error = true;
          } else {
            console.log(fs.lstatSync(link).mode);
            assert.equal(mode_async, fs.lstatSync(link).mode & 0o777);

            fs.lchmodSync(link, mode_sync);
            assert.equal(mode_sync, fs.lstatSync(link).mode & 0o777);
            success_count++;
          }
        });
      } else {
        success_count++;
      }
    }


    process.on('exit', function() {
      // BFS: Restore methods so we can continue unit testing.
      fs.open = (<any>fs)._open;
      fs.close = (<any>fs)._close;
      if (rootFS.supportsSynch()) {
        fs.openSync = (<any>fs)._openSync;
        fs.closeSync = (<any>fs)._closeSync;
      }
      if (rootFS.supportsLinks())
        assert.equal(3, success_count);
      else
        assert.equal(2, success_count);
      assert.equal(0, openCount);
      assert.equal(false, got_error);
    });
  }
};
