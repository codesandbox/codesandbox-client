import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  if (!fs.getRootFS().isReadOnly()) {
    var pathname1 = common.tmpDir + '/mkdir-test1';

    fs.mkdir(pathname1, function(err: NodeJS.ErrnoException) {
      assert.equal(err, null,
          'fs.mkdir(' + pathname1 + ') reports non-null error: ' + err);
      fs.exists(pathname1, function(y){
        assert.equal(y, true,
          'Got null error from fs.mkdir, but fs.exists reports false for ' + pathname1);
      });
    });

    var pathname2 = common.tmpDir + '/mkdir-test2';

    fs.mkdir(pathname2, 511 /*=0777*/, function(err) {
      assert.equal(err, null,
          'fs.mkdir(' + pathname2 + ') reports non-null error: ' + err);
      fs.exists(pathname2, function(y){
        assert.equal(y, true,
          'Got null error from fs.mkdir, but fs.exists reports false for ' + pathname2);
      });
    });

    // Shouldn't be able to make multi-level dirs.
    var pathname3 = common.tmpDir + '/mkdir-test3/again';
    fs.mkdir(pathname3, 511 /*=0777*/, function(err) {
      assert.notEqual(err, null, 'fs.mkdir(' + pathname3 + ') reports null error');
    });
  }
};
