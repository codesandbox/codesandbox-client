import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS(), wasThrown = false;
  if (rootFS.supportsSynch()) {
    try {
      fs.readdirSync(path.join(common.fixturesDir, "a.js"));
    } catch (e) {
      wasThrown = true;
      assert.equal(e.code, "ENOTDIR");
    }
    assert(wasThrown, "Failed invariant: Cannot call readdir on a file.");
    wasThrown = false;

    try {
      fs.readdirSync('/does/not/exist');
    } catch (e) {
      wasThrown = true;
      assert.equal(e.code, 'ENOENT');
    }
    assert(wasThrown, "Failed invariant: Cannot call readdir on a non-existant directory.");
    wasThrown = false;
  }

  // Async versions of the above.
  fs.readdir(path.join(common.fixturesDir, "a.js"), function(err, files) {
    assert(err, "Failed invariant: Cannot call readdir on a file.");
    assert.equal(err.code, 'ENOTDIR');
  });
  fs.readdir('/does/not/exist', function(err, files) {
    assert(err, "Failed invariant: Cannot call readdir on a non-existant directory.");
    assert.equal(err.code, "ENOENT");
  });

};
