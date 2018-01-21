import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var fn = path.join(common.fixturesDir, 'empty.txt');
  var rootFS = fs.getRootFS();

  fs.readFile(fn, function(err, data) {
    assert.ok(data);
  });

  fs.readFile(fn, 'utf8', function(err, data) {
    assert.strictEqual('', data);
  });

  if (rootFS.supportsSynch()) {
    assert.ok(fs.readFileSync(fn));
    assert.strictEqual('', fs.readFileSync(fn, 'utf8'));
  }
};
