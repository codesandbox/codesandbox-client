import _debug from '@codesandbox/common/lib/utils/debug';
import Manager from '../eval/manager';

const debug = _debug('cs:compiler:benchmarks');

export function generateBenchmarkInterface(manager: Manager) {
  return {
    transpilation: async (n = 10, path = '/src/index.js') => {
      const module = manager.resolveModule(path, '/');

      const times = [];
      for (let i = 0; i < n; i++) {
        const t = Date.now();
        // eslint-disable-next-line
        await manager.transpileModules(module);
        times.push(Date.now() - t);
        manager.clearTranspilationCache();
      }

      debug(
        `Transpilation Benchmark: ${times.reduce((p, j) => p + j, 0) / n}ms`
      );
    },
  };
}
