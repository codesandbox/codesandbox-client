import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var filename = path.join(common.fixturesDir, 'a.js');

  var caughtException = false;
  // Only run if the FS supports sync ops.
  var rootFS = fs.getRootFS();
  if (rootFS.supportsSynch()) {
    try {
      // should throw ENOENT, not EBADF
      // see https://github.com/joyent/node/pull/1228
      fs.openSync('/path/to/file/that/does/not/exist', 'r');
    }
    catch (e) {
      assert.equal(e.code, 'ENOENT');
      caughtException = true;
    }
    assert.ok(caughtException);
  }

  fs.open('/path/to/file/that/does/not/exist', 'r', function(e) {
    assert(e != null);
    assert.equal(e.code, 'ENOENT');
  });

  fs.open(filename, 'r', function(err, fd) {
    if (err) {
      throw err;
    }
    assert.ok(fd, 'failed to open with mode `r`: ' + filename);
  });

  fs.open(filename, 'rs', function(err, fd) {
    if (err) {
      throw err;
    }
    assert.ok(fd, 'failed to open with mode `rs`: ' + filename);
  });
};
