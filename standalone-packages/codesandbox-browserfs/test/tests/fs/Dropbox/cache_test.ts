import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

export default function() {
  fs.readdir('/', function(err, data) {
    assert(!err, "Failed to read root directory.");
    fs.readdir('/', function(err, data2) {
      assert(!err, "Failed to read root directory.");
      assert(data !== data2, "Dropbox cache should *copy* values from cache.");
    });

    // Same test, but for files.
    var file = '/test/fixtures/files/node/a.js';
    fs.readFile(file, function(err, data) {
      assert(!err, "Failed to read " + file);
      fs.readFile(file, function(err, data2) {
        assert(!err, "Failed to read file " + file);
        assert(data !== data2, "Dropbox cache should *copy* values from cache.");
      });
    });
  });

  var data = new Buffer("Hello, I am a dumb test file", "utf8");
  fs.writeFile('/cache_test_file.txt', data, function(err) {
    assert(!err, "Failed to write /cache_test_file.txt");
    fs.readFile('/cache_test_file.txt', function(err, data2) {
      assert(!err, "Failed to read '/cache_test_file'");
      assert(data2 !== data, "Cache should copy data *into* cache.");
    });
  });
};