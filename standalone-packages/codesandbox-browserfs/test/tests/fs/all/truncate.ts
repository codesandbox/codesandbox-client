import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

export default function() {
  var rootFS = fs.getRootFS(),
      isReadOnly = rootFS.isReadOnly();

  if (isReadOnly) {
    return;
  }
  var file = "/truncateFile.txt";
  fs.writeFile(file, new Buffer("123456789"), function (e) {
    assert(e == null);
    fs.truncate(file, 9, function (e) {
      assert(e == null);
      // Read it back, check contents.
      fs.readFile(file, function (e, data) {
        assert(e == null);
        assert(data.length === 9);
        assert(data.toString() === "123456789");
        // Truncating past the file size results in 0 padding.
        fs.truncate(file, 10, function (e) {
          assert(e == null);
          fs.readFile(file, function (e, data) {
            assert(e == null);
            assert(data.length === 10);
            assert(data.toString() === "123456789\u0000");
            // Can't truncate negatively.
            fs.truncate(file, -1, function (e) {
              assert(e != null);
              //assert(e.code === 'EINVAL');
              // Truncate to 0!
              fs.truncate(file, 0, function (e) {
                assert(e == null);
                fs.readFile(file, function (e, data) {
                  assert(e == null);
                  assert(data.toString() === '');
                });
              });
            });
          });
        });
      });
    });
  });
};
