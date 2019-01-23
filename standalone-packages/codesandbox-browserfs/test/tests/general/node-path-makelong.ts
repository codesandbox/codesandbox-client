import assert from '../../harness/wrapped-assert';
import * as path from 'path';

export default function() {
  assert.equal((<any> path)._makeLong(null), null);
  assert.equal((<any> path)._makeLong(100), 100);
  assert.equal((<any> path)._makeLong(path), path);
  assert.equal((<any> path)._makeLong(false), false);
  assert.equal((<any> path)._makeLong(true), true);
};
