import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  if (!fs.getRootFS().isReadOnly()) {
    var dirName = path.resolve(common.fixturesDir, 'test-readfile-unlink'),
        fileName = path.resolve(dirName, 'test.bin');

    var buf = new Buffer(512);
    buf.fill(42);

    fs.mkdir(dirName, function(err: NodeJS.ErrnoException) {
      if (err) throw err;
      fs.writeFile(fileName, buf, function(err) {
        if (err) throw err;
        fs.readFile(fileName, function(err, data) {
          assert.ifError(err);
          assert(data.length == buf.length);
          assert.strictEqual(buf[0], 42);

          fs.unlink(fileName, function(err) {
            if (err) throw err;
            fs.rmdir(dirName, function(err) {
              if (err) throw err;
            });
          });
        });
      });
    });
  }
};
