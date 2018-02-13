import fs from '../../../../src/core/node_fs';
import * as path from 'path';
import assert from '../../../harness/wrapped-assert';
import common from '../../../harness/common';

export default function() {
  var rootFS = fs.getRootFS();
  var canWrite = !rootFS.isReadOnly();
  var fn = path.join(common.fixturesDir, 'non-existent'),
      existingFile = path.join(common.fixturesDir, 'exit.js');

  // ASYNC_CALL

  fs.stat(fn, function(err) {
    assert.equal(fn, err.path);
    assert.ok(0 <= err.message.indexOf(fn));
  });

  fs.lstat(fn, function(err) {
    assert.equal(fn, err.path);
    assert.ok(0 <= err.message.indexOf(fn));
  });

  if (canWrite) {
    fs.unlink(fn, function(err) {
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    });

    fs.rename(fn, 'foo', function(err) {
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    });

    fs.rmdir(fn, function(err) {
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    });

    fs.mkdir(existingFile, 0o666, function(err) {
      assert.equal(existingFile, err.path);
      assert.ok(0 <= err.message.indexOf(existingFile));
    });

    fs.rmdir(existingFile, function(err) {
      assert.equal(existingFile, err.path);
      assert.ok(0 <= err.message.indexOf(existingFile));
    });
  }

  fs.open(fn, 'r', 0o666, function(err) {
    assert.equal(fn, err.path);
    assert.ok(0 <= err.message.indexOf(fn));
  });

  fs.readFile(fn, function(err) {
    assert.equal(fn, err.path);
    assert.ok(0 <= err.message.indexOf(fn));
  });

  // BFS: Only run if the FS supports links
  if (rootFS.supportsLinks()) {
    fs.readlink(fn, function(err) {
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    });

    if (canWrite) {
      fs.link(fn, 'foo', function(err) {
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      });
    }
  }

  if (rootFS.supportsProps() && canWrite ) {
    fs.chmod(fn, 0o666, function(err) {
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    });
  }

  var expected = 0;
  // Sync
  // BFS: Only run if the FS supports sync ops
  if (rootFS.supportsSynch()) {
    var errors: string[] = [];

    try {
      ++expected;
      fs.statSync(fn);
    } catch (err) {
      errors.push('stat');
      assert.equal(fn, err.path);
      assert.ok(0 <= err.message.indexOf(fn));
    }

    if (canWrite) {
      try {
        ++expected;
        fs.mkdirSync(existingFile, 0o666);
      } catch (err) {
        errors.push('mkdir');
        assert.equal(existingFile, err.path);
        assert.ok(0 <= err.message.indexOf(existingFile));
      }

      try {
        ++expected;
        fs.rmdirSync(fn);
      } catch (err) {
        errors.push('rmdir');
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      }

      try {
        ++expected;
        fs.rmdirSync(existingFile);
      } catch (err) {
        errors.push('rmdir');
        assert.equal(existingFile, err.path);
        assert.ok(0 <= err.message.indexOf(existingFile));
      }

      try {
        ++expected;
        fs.renameSync(fn, 'foo');
      } catch (err) {
        errors.push('rename');
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      }

      try {
        ++expected;
        fs.lstatSync(fn);
      } catch (err) {
        errors.push('lstat');
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      }

      try {
        ++expected;
        fs.openSync(fn, 'r');
      } catch (err) {
        errors.push('opens');
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      }

      try {
        ++expected;
        fs.readdirSync(fn);
      } catch (err) {
        errors.push('readdir');
        assert.equal(fn, err.path);
        assert.ok(0 <= err.message.indexOf(fn));
      }

      try {
        ++expected;
        fs.unlinkSync(fn);
      } catch (err) {
        errors.push('unlink');
        assert.ok(0 <= err.message.indexOf(fn));
      }

      if (rootFS.supportsProps()) {
        try {
          ++expected;
          fs.chmodSync(fn, 0o666);
        } catch (err) {
          errors.push('chmod');
          assert.equal(fn, err.path);
          assert.ok(0 <= err.message.indexOf(fn));
        }
      }

      if (rootFS.supportsLinks()) {
        try {
          ++expected;
          fs.linkSync(fn, 'foo');
        } catch (err) {
          errors.push('link');
          assert.equal(fn, err.path);
          assert.ok(0 <= err.message.indexOf(fn));
        }

        try {
          ++expected;
          fs.readlinkSync(fn);
        } catch (err) {
          errors.push('readlink');
          assert.equal(fn, err.path);
          assert.ok(0 <= err.message.indexOf(fn));
        }
      }
    }
  }

  process.on('exit', function() {
    if (rootFS.supportsSynch()) {
      assert.equal(expected, errors.length,
                   'Test fs sync exceptions raised, got ' + errors.length +
                   ' expected ' + expected);
    }
  });
};
