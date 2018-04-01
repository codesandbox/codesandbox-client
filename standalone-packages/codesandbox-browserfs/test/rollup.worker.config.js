import rollupConfig from './rollup.config.js';
import { join } from 'path';
const outBase = join(__dirname, '..', 'build', 'temp', 'tests');

rollupConfig.entry = join(
  outBase,
  'ts',
  'test',
  'harness',
  'factories',
  'workerfs_worker.js'
);
rollupConfig.dest = join(outBase, 'rollup', 'test_worker.rollup.js');

export default rollupConfig;
