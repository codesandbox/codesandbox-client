import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  //var openCount = 0;
  var mode: number;
  var content: string;
  var rootFS = fs.getRootFS();

  // Removes a file if it exists.
  function removeFile(file: string) {
    try {
      //if (isWindows)
      //  fs.chmodSync(file, 0666);
      fs.unlinkSync(file);
    } catch (err) {
      if (err && err.code !== 'ENOENT')
        throw err;
    }
  }

  function openSync() {
    //openCount++;
    return (<any>rootFS)._openSync.apply(rootFS, arguments);
  }

  function closeSync() {
    //openCount--;
    return (<any>fs)._closeSync.apply(fs, arguments);
  }

  // Only works for file systems that support synchronous ops.
  if (!(rootFS.isReadOnly() || !rootFS.supportsSynch())) {
    // Need to hijack fs.open/close to make sure that things
    // get closed once they're opened.
    (<any>rootFS)._openSync = rootFS.openSync;
    rootFS.openSync = openSync;
    (<any>fs)._closeSync = fs.closeSync;
    fs.closeSync = closeSync;

    // BFS: Restore old handlers.
    process.on('exit', function() {
      rootFS.openSync = (<any>rootFS)._openSync;
      fs.closeSync = (<any>fs)._closeSync;
    });

    // Reset the umask for testing
    // BFS: Not supported.
    //var mask = process.umask(0);

    // On Windows chmod is only able to manipulate read-only bit. Test if creating
    // the file in read-only mode works.
    mode = 0o755;

    // Test writeFileSync
    var file1 = path.join(common.tmpDir, 'testWriteFileSync.txt');
    removeFile(file1);

    fs.writeFileSync(file1, '123', {mode: mode});

    content = fs.readFileSync(file1, {encoding: 'utf8'});
    assert.equal('123', content,
        'File contents mismatch: \'' + content + '\' != \'123\'');

    if (rootFS.supportsProps()) {
      var actual = fs.statSync(file1).mode & 0o777;
      assert.equal(mode, actual,
        'Expected mode 0' + mode.toString(8) + ', got mode 0' + actual.toString(8));
    }

    removeFile(file1);

    // Test appendFileSync
    var file2 = path.join(common.tmpDir, 'testAppendFileSync.txt');
    removeFile(file2);

    fs.appendFileSync(file2, 'abc', {mode: mode});

    content = fs.readFileSync(file2, {encoding: 'utf8'});
    assert.equal('abc', content,
        'File contents mismatch: \'' + content + '\' != \'abc\'');

    if (rootFS.supportsProps()) {
      assert.equal(mode, fs.statSync(file2).mode & mode);
    }

    removeFile(file2);

    // Verify that all opened files were closed.
    // BFS: Some file systems call themselves, and not the node API directly.
    // assert.equal(0, openCount);
  }
};
