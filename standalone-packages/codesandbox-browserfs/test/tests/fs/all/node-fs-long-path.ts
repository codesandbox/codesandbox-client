import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  if (!fs.getRootFS().isReadOnly()) {
    // make a path that will be at least 260 chars long.
    var fileNameLen = Math.max(260 - common.tmpDir.length - 1, 1);
    var fileName = path.join(common.tmpDir, new Array(fileNameLen + 1).join('x'));
    var fullPath = path.resolve(fileName);

    fs.writeFile(fullPath, 'ok', function(err) {
      if (err) throw err;

      fs.stat(fullPath, function(err, stats) {
        if (err) throw err;
        assert.equal(2, stats.size, 'stats.size: expected 2, got: ' + stats.size);
      });
    });


    process.on('exit', function() {
      fs.unlink(fullPath);
      //assert.equal(2, successes);
    });
  }
};
