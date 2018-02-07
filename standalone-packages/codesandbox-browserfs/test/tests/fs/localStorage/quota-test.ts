import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

export default function() {
  // Ignore Opera; it lets the user expand the LocalStorage quota as a syncronous
  // blocking popup, interrupting our test.
  if (!(typeof navigator !== "undefined" && navigator.userAgent.indexOf("Presto") > -1)) {
    // Avoid encoding overhead, and store 256KB chunks until LS is full.
    var numChunks = 0, chunk = "";
    for (let i = 0; i < 256*1024; i++) {
      chunk += " ";
    }
    try {
      while (1) {
        localStorage.setItem('bigChunk' + numChunks, chunk);
        numChunks++;
      }
    } catch (e) {
      // LS is full.
    }


    // Attempt to store another 512KB. (Due to our binary string compression, we store it as 256KB on some platforms.)
    var bigbuff = new Buffer(512*1024);
    var errorThrown = false;
    // Try to write it to local storage. Should get an error!
    try {
      fs.writeFileSync("/bigfile.txt", bigbuff);
    } catch (e) {
      errorThrown = true;
      assert(e.code === 'ENOSPC');
    } finally {
      // Clean up.
      while (numChunks > 0) {
        localStorage.removeItem('bigChunk' + (--numChunks));
      }
    }

    assert(errorThrown);
  }
};
