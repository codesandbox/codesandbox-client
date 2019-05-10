import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

export default function() {
  var rootFS = fs.getRootFS();
  if (!rootFS.isReadOnly()) {
    // Ensure we cannot remove directories that are non-empty.
    fs.mkdir('/rmdirTest', function(e: NodeJS.ErrnoException) {
      assert(!e);
      fs.mkdir('/rmdirTest/rmdirTest2', function(e: NodeJS.ErrnoException) {
        assert(!e);
        fs.rmdir('/rmdirTest', function(e) {
          assert(Boolean(e), "Invariant failed: Successfully removed a non-empty directory.");
          assert(e.code === "ENOTEMPTY");
        });
      });
    });
  }
};
