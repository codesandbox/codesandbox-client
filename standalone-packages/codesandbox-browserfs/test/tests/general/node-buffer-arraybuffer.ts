import assert from '../../harness/wrapped-assert';

export default function() {
  var LENGTH = 16,
    ab = new ArrayBuffer(LENGTH),
    dv = new DataView(ab),
    ui = new Uint8Array(ab),
    buf = new Buffer(ab);


  assert.ok(buf instanceof Buffer);
  // For backwards compatibility of old .parent property test that if buf is not
  // a slice then .parent should be undefined.
  // BFS: We don't abide by these properties.
  // assert.equal(buf.parent, undefined);
  // assert.equal(buf.buffer, ab);
  assert.equal(buf.length, ab.byteLength);


  buf.fill(0xC);
  for (var i = 0; i < LENGTH; i++) {
    assert.equal(ui[i], 0xC);
    ui[i] = 0xF;
    assert.equal(buf[i], 0xF);
  }

  buf.writeUInt32LE(0xF00, 0);
  buf.writeUInt32BE(0xB47, 4);
  buf.writeDoubleLE(3.1415, 8);

  assert.equal(dv.getUint32(0, true), 0xF00);
  assert.equal(dv.getUint32(4), 0xB47);
  assert.equal(dv.getFloat64(8, true), 3.1415);
};
