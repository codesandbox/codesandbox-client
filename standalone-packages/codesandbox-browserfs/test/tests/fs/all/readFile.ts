import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS(), wasThrown = false;
  if (rootFS.supportsSynch()) {
    try {
      fs.readFileSync(path.join(common.fixturesDir, 'a.js'), 'wrongencoding');
    } catch (e) {
      wasThrown = true;
    }
    assert(wasThrown, "Failed invariant: Cannot read a file with an invalid encoding.");
  }

  fs.readFile(path.join(common.fixturesDir, 'a.js'), 'wrongencoding', function(err, data) {
    assert(err, "Failed invariant: Cannot read a file with an invalid encoding.");
  });

  fs.open(path.join(common.fixturesDir, 'a.js'), 'r', function(err, fd) {
    assert(!err, 'Failed to open a.js from fixtures.');
    var buffData = new Buffer(10);
    fs.read(fd, buffData, 0, 10, 10000, function(err, bytesRead, buffer) {
      assert(!err, 'Reading past the end of a file should not be an error.');
      assert.strictEqual(bytesRead, 0, 'Reading past the end of a file should report 0 bytes read.')
      assert.strictEqual(buffer, buffData, 'Read should return same buffer passed in.');
    });
  });
};
