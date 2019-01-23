import assert from '../../harness/wrapped-assert';

export default function() {
  var zero: Buffer[] = [];
  var one = [ new Buffer('asdf') ];
  var _long: Buffer[] = [];
  for (var i = 0; i < 10; i++) _long.push(new Buffer('asdf'));

  var flatZero = Buffer.concat(zero);
  var flatOne = Buffer.concat(one);
  var flatLong = Buffer.concat(_long);
  var flatLongLen = Buffer.concat(_long, 40);

  assert(flatZero.length === 0);
  assert(flatOne.toString() === 'asdf');
  // A special case where concat used to return the first item,
  // if the length is one. This check is to make sure that we don't do that.
  assert(flatOne !== one[0]);
  assert(flatLong.toString() === (new Array(10+1).join('asdf')));
  assert(flatLongLen.toString() === (new Array(10+1).join('asdf')));
  assert.throws(function() {
    Buffer.concat(<any> [42]);
  }, TypeError);
  // BFS: Adding for good measure.
  assert.throws(function() {
    Buffer.concat(<any> [42], 10);
  }, TypeError);
};
