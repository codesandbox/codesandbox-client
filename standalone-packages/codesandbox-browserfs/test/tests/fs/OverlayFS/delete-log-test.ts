/**
 * Ensures that the deletion log works properly.
 */
import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';
import OverlayFS from '../../../../src/backend/OverlayFS';
const logPath = '/.deletedFiles.log';
declare var __numWaiting: number;

export default function() {
  // HACK around TypeScript bug.
  if (__numWaiting) {}
  var rootFS = (<OverlayFS> fs.getRootFS()).unwrap(),
    fses = rootFS.getOverlayedFileSystems(),
    // XXX: Make these proper API calls.
    readable = fses.readable,
    writable = fses.writable;
  // Back up the current log.
  var deletionLog = rootFS.getDeletionLog();
  // Delete a file in the underlay.
  fs.unlinkSync('/test/fixtures/files/node/a.js');
  assert(!fs.existsSync('/test/fixtures/files/node/a.js'), 'Failed to properly delete a.js.');
  // Try to move the deletion log.
  assert.throws(function() { fs.renameSync(logPath, logPath + "2"); }, 'Should not be able to rename the deletion log.');
  // Move another file over the deletion log.
  assert.throws(function() { fs.renameSync('/test/fixtures/files/node/a1.js', logPath); }, 'Should not be able to rename a file over the deletion log.');
  // Remove the deletion log.
  assert.throws(function() { fs.unlinkSync(logPath); }, 'Should not be able to delete the deletion log.');
  // Open the deletion log.
  assert.throws(function() { fs.openSync(logPath, 'r'); }, 'Should not be able to open the deletion log.');
  // Re-write a.js.
  fs.writeFileSync('/test/fixtures/files/node/a.js', new Buffer("hi", "utf8"));
  assert(fs.existsSync('/test/fixtures/files/node/a.js'), 'Failed to properly restore a.js.');
  // Remove something else.
  fs.unlinkSync('/test/fixtures/files/node/a1.js');
  assert(!fs.existsSync('/test/fixtures/files/node/a1.js'), 'Failed to properly delete a1.js.');
  // Wait for OverlayFS to persist delete log changes.
  __numWaiting++;
  var interval = setInterval(function() {
    if (!(<any> rootFS)._deleteLogUpdatePending) {
      clearInterval(interval);
      next();
    }
  }, 4);
  function next() {
    __numWaiting--;
    // Re-mount OverlayFS.
    OverlayFS.Create({
      writable, readable
    }, (e, overlayFs?) => {
      assert(!e, 'Received initialization error.');
      rootFS = <any> overlayFs;
      fs.initialize(rootFS);
      rootFS = (<OverlayFS> <any> rootFS).unwrap();
      assert(fs.existsSync('/test/fixtures/files/node/a.js'), 'a.js\'s restoration was not persisted.');
      rootFS.restoreDeletionLog('');
      assert(fs.existsSync('/test/fixtures/files/node/a1.js'), 'a1.js\'s restoration was not persisted.');
      // Manually restore original deletion log.
      rootFS.restoreDeletionLog(deletionLog);
    });
  }
};
