import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var successes = 0;
  var file = path.join(common.fixturesDir, 'a.js');
  var rootFS = fs.getRootFS();
  if (!rootFS.isReadOnly()) {
    fs.open(file, 'a', 0o777, function(err, fd) {
      if (err) throw err;

      if (rootFS.supportsSynch()) {
        fs.fdatasyncSync(fd);
        successes++;

        fs.fsyncSync(fd);
        successes++;
      }

      fs.fdatasync(fd, function(err) {
        if (err) throw err;
        successes++;
        fs.fsync(fd, function(err) {
          if (err) throw err;
          successes++;
        });
      });
    });

    process.on('exit', function() {
      if (rootFS.supportsSynch()) {
        assert.equal(4, successes);
      } else {
        assert.equal(2, successes);
      }
    });
  }
};
