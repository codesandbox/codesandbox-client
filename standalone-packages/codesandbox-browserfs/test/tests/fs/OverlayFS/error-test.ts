/**
 * Ensures that OverlayFS throws initialization errors.
 */
import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';
import OverlayFS from '../../../../src/backend/OverlayFS';

export default function() {
  var rootFS = fs.getRootFS(),
    fses = (<OverlayFS> rootFS).getOverlayedFileSystems(),
    // XXX: Make these proper API calls.
    readable = fses.readable,
    writable = fses.writable;
  fs.initialize(new OverlayFS(writable, readable));

  var err: NodeJS.ErrnoException = null;
  try {
    fs.readdirSync('/');
  } catch (e) {
    err = e;
  }
  assert(err !== null, 'OverlayFS should throw an exception if it is not initialized.');

  try {
    fs.readdir('/', function(err) {
      assert(Boolean(err), 'OverlayFS should pass an exception to its callback if it is not initialized.');
    });
  } catch (e) {
    assert(false, 'OverlayFS should never *throw* an exception on an asynchronous API call.');
  }

  process.on('exit', function() {
    // Restore saved file system.
    fs.initialize(rootFS);
  });
};
