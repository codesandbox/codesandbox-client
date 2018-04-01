import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var filepath = path.join(common.fixturesDir, 'x.txt'),
      expected = 'xyz\n',
      readCalled = 0,
      rootFS = fs.getRootFS();

  fs.open(filepath, 'r', function(err, fd) {
    if (err) throw err;

    fs.read(fd, expected.length, 0, 'utf-8', function(err, str, bytesRead) {
      readCalled++;

      assert.ok(!err);
      assert.equal(str, expected);
      assert.equal(bytesRead, expected.length);
    });

    if (rootFS.supportsSynch()) {
      var r = fs.readSync(fd, expected.length, 0, 'utf-8');
      assert.equal(r[0], expected);
      assert.equal(r[1], expected.length);
    }
  });

  process.on('exit', function() {
    assert.equal(readCalled, 1);
  });
};
