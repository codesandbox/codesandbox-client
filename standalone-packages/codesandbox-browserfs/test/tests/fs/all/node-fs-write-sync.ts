import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS();
  if (!(rootFS.isReadOnly() || !rootFS.supportsSynch())) {
    var fn = path.join(common.tmpDir, 'write.txt');


    var foo = 'foo';
    var fd = fs.openSync(fn, 'w');

    var written = fs.writeSync(fd, '');
    assert.strictEqual(0, written);

    fs.writeSync(fd, foo);

    var bar = 'bár';
    written = fs.writeSync(fd, new Buffer(bar), 0, Buffer.byteLength(bar));
    assert.ok(written > 3);
    fs.closeSync(fd);

    assert.equal(fs.readFileSync(fn).toString(), 'foobár');
  }
};
