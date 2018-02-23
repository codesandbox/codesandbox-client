import assert from '../../harness/wrapped-assert';
import * as buffer from 'buffer';
const SlowBuffer = buffer.SlowBuffer,
 ones = [1, 1, 1, 1];

// BFS: Changed deepEqual -> equal on toJSON.
function equalCheck(b1: Buffer, b2: Buffer | number[]) {
  if (!Buffer.isBuffer(b2)) {
    b2 = new Buffer(b2);
  }
  assert.equal(JSON.stringify(b1), JSON.stringify(b2));
}

export default function() {
  // should create a Buffer
  var sb = new SlowBuffer(4);
  assert(sb instanceof Buffer);
  assert.strictEqual(sb.length, 4);
  sb.fill(1);
  equalCheck(sb, ones);

  // BFS: Do not support.
  // underlying ArrayBuffer should have the same length
  //assert.strictEqual(sb.buffer.byteLength, 4);

  // should work without new
  sb = (<any> SlowBuffer)(4);
  assert(sb instanceof Buffer);
  assert.strictEqual(sb.length, 4);
  sb.fill(1);
  equalCheck(sb, ones);

  // should work with edge cases
  assert.strictEqual(new SlowBuffer(0).length, 0);
  // BFS: I don't do pooling like Node.
  /*try {
    assert.strictEqual(SlowBuffer(buffer.kMaxLength).length, buffer.kMaxLength);
  } catch (e) {
    assert.equal(e.message, 'Invalid array buffer length');
  }*/

  // should work with number-coercible values
  assert.strictEqual(new SlowBuffer('6').length, 6);
  assert.strictEqual(new SlowBuffer(<any> true).length, 1);

  // should create zero-length buffer if parameter is not a number
  assert.strictEqual(new (<any> SlowBuffer)().length, 0);
  assert.strictEqual(new SlowBuffer(NaN).length, 0);
  assert.strictEqual(new SlowBuffer(<any>{}).length, 0);
  assert.strictEqual(new SlowBuffer('string').length, 0);

  // should throw with invalid length
  assert.throws(function() {
    new SlowBuffer(Infinity);
  }, 'invalid Buffer length');
  assert.throws(function() {
    new SlowBuffer(-1);
  }, 'invalid Buffer length');
  // BFS: No kMaxLength.
  /*assert.throws(function() {
    new SlowBuffer(buffer.kMaxLength + 1);
  }, 'invalid Buffer length');*/
};