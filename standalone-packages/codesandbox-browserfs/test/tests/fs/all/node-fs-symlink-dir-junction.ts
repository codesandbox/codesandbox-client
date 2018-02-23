import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var completed = 0;
  var expected_tests = 4;

  // test creating and reading symbolic link
  var linkData = path.join(common.fixturesDir, 'cycles/');
  var linkPath = path.join(common.tmpDir, 'cycles_link');

  var rootFS = fs.getRootFS();
  if (!(rootFS.isReadOnly() || !rootFS.supportsLinks())) {
    // Delete previously created link
    fs.unlink(linkPath, function(err) {
      if (err) throw err;
      console.log('linkData: ' + linkData);
      console.log('linkPath: ' + linkPath);

      fs.symlink(linkData, linkPath, 'junction', function(err) {
        if (err) throw err;
        completed++;

        fs.lstat(linkPath, function(err, stats) {
          if (err) throw err;
          assert.ok(stats.isSymbolicLink());
          completed++;

          fs.readlink(linkPath, function(err, destination) {
            if (err) throw err;
            assert.equal(destination, linkData);
            completed++;

            fs.unlink(linkPath, function(err) {
              if (err) throw err;
              assert(!fs.existsSync(linkPath));
              assert(fs.existsSync(linkData));
              completed++;
            });
          });
        });
      });
    });

    process.on('exit', function() {
      assert.equal(completed, expected_tests);
    });
  }
};
