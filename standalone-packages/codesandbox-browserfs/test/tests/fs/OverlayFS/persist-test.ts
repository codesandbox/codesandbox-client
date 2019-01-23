/**
 * Ensures that changes to OverlayFS appropriately persists across instantiations.
 * Side effect: Discards doubly-loaded files (files are present in ZipFS, but are
 * accidentally re-written and reloaded by test runner). This is a Good Thing.
 */
import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';
import OverlayFS from '../../../../src/backend/OverlayFS';
import InMemory from '../../../../src/backend/InMemory';

export default function() {
  var rootFS = fs.getRootFS(),
    fses = (<OverlayFS> rootFS).getOverlayedFileSystems(),
    // XXX: Make these proper API calls.
    readable = fses.readable,
    writable = fses.writable;

  // Ensure no files are doubled.
  var seenMap: string[] = [];
  fs.readdirSync('/test/fixtures/files/node').forEach(function(file) {
    assert(seenMap.indexOf(file) === -1, "File " + file + " cannot exist multiple times.");
    seenMap.push(file);
    fs.unlinkSync('/test/fixtures/files/node/' + file);
  });

  fs.rmdirSync('/test/fixtures/files/node');

  assert(fs.existsSync('/test/fixtures/files/node') === false, 'Directory must be deleted');
  assert(fs.readdirSync('/test/fixtures/files').indexOf('node') === -1, 'Directory must be empty.');

  OverlayFS.Create({readable, writable}, (e, newCombined) => {
    assert(newCombined.existsSync('/test/fixtures/files/node') === false, 'Directory must still be deleted.');
    assert(newCombined.readdirSync('/test/fixtures/files').indexOf('node') === -1, "Directory must still be empty.");

    InMemory.Create({}, (e, writable) => {
      OverlayFS.Create({ writable, readable}, (e, newFs) => {
        fs.initialize(newFs);
        assert(fs.existsSync('/test/fixtures/files/node') === true, "Directory must be back");
        assert(fs.readdirSync('/test/fixtures/files').indexOf('node') > -1, "Directory must be back.");
        // XXX: Remake the tmpdir.
        fs.mkdirSync(common.tmpDir);
      });
    });
  });
};
