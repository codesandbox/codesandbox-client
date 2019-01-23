import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var completed = 0;
  var expected_tests = 2;
  var rootFS = fs.getRootFS();

  // BFS: Link/symlink support is required for this test.
  if (rootFS.supportsLinks()) {
    var runtest = function(skip_symlinks: boolean) {
      if (!skip_symlinks) {
        // test creating and reading symbolic link
        var linkData = path.join(common.fixturesDir, '/cycles/root.js');
        var linkPath = path.join(common.tmpDir, 'symlink1.js');

        // Delete previously created link
        try {
          fs.unlinkSync(linkPath);
        } catch (e) {}

        fs.symlink(linkData, linkPath, function(err) {
          if (err) throw err;
          console.log('symlink done');
          // todo: fs.lstat?
          fs.readlink(linkPath, function(err, destination) {
            if (err) throw err;
            assert.equal(destination, linkData);
            completed++;
          });
        });
      }

      // test creating and reading hard link
      var srcPath = path.join(common.fixturesDir, 'cycles', 'root.js');
      var dstPath = path.join(common.tmpDir, 'link1.js');

      // Delete previously created link
      try {
        fs.unlinkSync(dstPath);
      } catch (e) {}

      fs.link(srcPath, dstPath, function(err) {
        if (err) throw err;
        console.log('hard link done');
        var srcContent = fs.readFileSync(srcPath, 'utf8');
        var dstContent = fs.readFileSync(dstPath, 'utf8');
        assert.equal(srcContent, dstContent);
        completed++;
      });
    };

    runtest(false);

    process.on('exit', function() {
      assert.equal(completed, expected_tests);
    });
  }
};
