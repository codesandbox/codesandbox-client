import fs from '../../../../src/core/node_fs';
import assert from '../../../harness/wrapped-assert';

const root = '/test/fixtures/files/isofs';
export default function() {
  let p = root;
  let dirs = fs.readdirSync(p);
  for (let i = 1; i < 9; i++) {
    assert(dirs.indexOf(i.toString()) !== -1, `ISO is missing directory ${i}`);
    p = `${p}/${i}`;
    dirs = fs.readdirSync(p);
  }
  assert(fs.readFileSync(`${p}/test_file.txt`).toString().slice(0, 14) === `ISO9660 has a `, 'Invalid file contents for test_file.txt');
};
