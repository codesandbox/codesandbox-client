import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  if (!fs.getRootFS().isReadOnly()) {
    var filename = path.join(common.tmpDir, 'write.txt'),
        expected = new Buffer('hello'),
        openCalled = 0,
        writeCalled = 0;


    fs.open(filename, 'w', 0o644, function(err, fd) {
      openCalled++;
      if (err) throw err;

      fs.write(fd, expected, 0, expected.length, null, function(err, written) {
        writeCalled++;
        if (err) throw err;

        assert.equal(expected.length, written);
        fs.close(fd, function(err) {
          if (err) throw err;
          fs.readFile(filename, 'utf8', function(err, found) {
            assert.deepEqual(expected.toString(), found);
            fs.unlink(filename, function(err) {
              if (err) throw err;
            });
          });
        });
      });
    });

    process.on('exit', function() {
      assert.equal(1, openCalled);
      assert.equal(1, writeCalled);
    });
  }
};
