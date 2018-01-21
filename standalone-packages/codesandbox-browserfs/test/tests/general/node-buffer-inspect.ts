import assert from '../../harness/wrapped-assert';
import * as BrowserFS from '../../../src/core/browserfs';

// BFS: Switching 'util.inspect' to 'buffer.inspect'.
export default function() {
  let buffer = BrowserFS.BFSRequire('buffer');
  var IMB = buffer.INSPECT_MAX_BYTES;
  (<any> buffer).INSPECT_MAX_BYTES = 2;

  var b = new Buffer(4);
  b.fill('1234');

  var s = new buffer.SlowBuffer(4);
  s.fill('1234');

  var expected = '<Buffer 31 32 ... >';

  assert.strictEqual((<any> b).inspect(b), expected);
  assert.strictEqual((<any> b).inspect(s), expected);

  b = new Buffer(2);
  b.fill('12');

  s = new buffer.SlowBuffer(2);
  s.fill('12');

  expected = '<Buffer 31 32>';

  assert.strictEqual((<any> b).inspect(b), expected);
  assert.strictEqual((<any> b).inspect(s), expected);

  (<any> buffer).INSPECT_MAX_BYTES = Infinity;

  assert.doesNotThrow(function() {
    assert.strictEqual((<any> b).inspect(b), expected);
    assert.strictEqual((<any> b).inspect(s), expected);
  });
  (<any> buffer).INSPECT_MAX_BYTES = IMB;
};