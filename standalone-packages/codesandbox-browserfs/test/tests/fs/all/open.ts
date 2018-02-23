import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS(), hasThrown = false;
  if (rootFS.supportsSynch()) {
    try {
      fs.openSync(common.fixturesDir, 'r');
    } catch (e) {
      hasThrown = true;
      assert.equal(e.code, 'EISDIR');
    }
    assert(hasThrown, "Failed invariant: Cannot open() a directory.");
    hasThrown = false;
  }

  // Async versions of the above.
  fs.open(common.fixturesDir, 'r', function(err, fd) {
    assert(err, "Failed invariant: Cannot open() a directory.");
    assert.equal(err.code, 'EISDIR');
  });

  if (!rootFS.isReadOnly()) {
    if (rootFS.supportsSynch()) {
      try {
        fs.openSync(common.fixturesDir, 'wx');
      } catch (e) {
        hasThrown = true;
        assert(e.code === 'EISDIR' || e.code === 'EEXIST', "Expected EISDIR or EEXIST, got " + e.code);
      }
      assert(hasThrown, "Failed invariant: Cannot open() an existing file exclusively.");
      hasThrown = false;

      try {
        fs.openSync(path.join(common.fixturesDir, 'a.js'), 'wx');
      } catch (e) {
        hasThrown = true;
        assert.equal(e.code, 'EEXIST');
      }
      assert(hasThrown, "Failed invariant: Open exclusively demands that the file does not exist.");
      hasThrown = false;
    }

    // Async versions of the above.
    fs.open(common.fixturesDir, 'wx', function(err, fd) {
      assert(err, "Failed invariant: Cannot open() an existing file exclusively.");
      assert(err.code === 'EISDIR' || err.code === 'EEXIST', "Expected EISDIR or EEXIST, got " + err.code);
    });

    fs.open(path.join(common.fixturesDir, 'a.js'), 'wx', function(err, fd) {
      assert(err, "Failed invariant: Open exclusively demands that the file does not exist.");
      assert.equal(err.code, 'EEXIST');
    });
  } else {
    // READ-ONLY tests!
    if (rootFS.supportsSynch()) {
      ['a', 'w'].forEach(function(mode) {
        try {
          fs.openSync(path.join(common.fixturesDir, 'a.js'), mode);
        } catch (e) {
          hasThrown = true;
          assert.equal(e.code, 'EPERM');
        }
        assert(hasThrown, "Failed invariant: Cannot write to RO file system.");
        hasThrown = false;
      });
    }

    // Async versions of the above.
    ['a', 'w'].forEach(function(mode) {
      fs.open(path.join(common.fixturesDir, 'a.js'), mode, function(err, fd) {
        assert(err, "Failed invariant: Cannot write to RO file system.");
        assert.equal(err.code, 'EPERM');
      });
    });
  }
};