/**
 * Unit tests for HTTPDownloadFS
 */
import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';
import * as BrowserFS from '../../../../src/core/browserfs';

type Listing = {[name: string]: Listing | any};

export default function() {
  let oldRootFS = fs.getRootFS();

  let listing: Listing = {
    "README.md": null,
    "test": {
      "fixtures": {
        "static": {
          "49chars.txt": null
        }
      }
    },
    "src":{
      "README.md": null,
      "backend":{"AsyncMirror.ts": null, "XmlHttpRequest.ts": null, "ZipFS.ts": null},
      "main.ts": null
    }
  }

  BrowserFS.FileSystem.XmlHttpRequest.Create({
    index: listing,
    baseUrl: "/"
  }, (e, newXFS) => {
    BrowserFS.initialize(newXFS);

    let t1text = 'Invariant fail: Can query folder that contains items and a mount point.';
    let expectedTestListing = ['README.md', 'src', 'test'];
    let testListing = fs.readdirSync('/').sort();
    assert.deepEqual(testListing, expectedTestListing, t1text);

    fs.readdir('/', function(err, files) {
      assert(!err, t1text);
      assert.deepEqual(files.sort(), expectedTestListing, t1text);
      fs.stat("/test/fixtures/static/49chars.txt", function(err, stats) {
        assert(!err, "Can stat an existing file");
        assert(stats.isFile(), "File should be interpreted as a file");
        assert(!stats.isDirectory(), "File should be interpreted as a directory");
        // NOTE: Size is 50 in Windows due to line endings.
        assert(stats.size == 49 || stats.size == 50, "file size should match");
      });

      fs.stat("/src/backend", function(err, stats) {
        assert(!err, "Can stat an existing directory");
        assert(stats.isDirectory(), "directory should be interpreted as a directory");
        assert(!stats.isFile(), "directory should be interpreted as a file");
      });

      fs.stat("/src/not-existing-name", function(err, stats) {
        assert(Boolean(err), "Non existing file should return an error");
      });

    });
  });

  assert(BrowserFS.FileSystem.XmlHttpRequest === BrowserFS.FileSystem.HTTPRequest, `Maintains XHR file system for backwards compatibility.`);

  // Restore test FS on test end.
  process.on('exit', function() {
    BrowserFS.initialize(oldRootFS);
  });
};
