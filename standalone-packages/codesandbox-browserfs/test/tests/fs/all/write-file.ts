import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

export default function() {
  var rootFS = fs.getRootFS(),
    isReadOnly = rootFS.isReadOnly(),
    fileName = '/writeFileText.txt';

  if (!isReadOnly) {
    fs.writeFile(fileName, new Buffer("Hello!"), function(err) {
      assert(!err, 'Failed to write a file.');
      fs.writeFile(fileName, new Buffer("Hello 2!"), function(err) {
        assert(!err, 'Failed to overwrite a file with writeFile.');
        fs.readFile(fileName, function(err, data) {
          assert(!err, 'Failed to read file that we wrote.');
          assert.equal(data.toString('utf8'), 'Hello 2!');
        });
      });
    });
  }
};