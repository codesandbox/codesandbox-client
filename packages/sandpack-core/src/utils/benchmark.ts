import _debug from '@codesandbox/common/lib/utils/debug';
import {
  clearMeasurements,
  measure,
  endMeasure,
  getMeasurements,
  getCumulativeMeasure,
} from '@codesandbox/common/lib/utils/metrics';
import Manager from '../manager';

const debug = _debug('cs:compiler:benchmarks');

interface TranspilationTimes {
  total: number;
  transpile: number;
  resolving: number;
  esConverting: number;
}

const printTranspilationMeasurements = (results: TranspilationTimes) => {
  debug(`Total ${results.total.toFixed(2)}ms`);
  debug(`  Transpiling ${results.transpile.toFixed(2)}ms`);
  debug(`  Resolving ${results.resolving.toFixed(2)}ms`);
  debug(`  Converting ES ${results.esConverting.toFixed(2)}ms`);
};

export function generateBenchmarkInterface(manager: Manager) {
  return {
    transpilation: async (n = 10, path = '/src/index.js') => {
      const module = await manager.resolveModuleAsync({
        path,
      });

      const times: TranspilationTimes[] = [];
      for (let i = 0; i < n; i++) {
        manager.clearTranspilationCache();
        manager.cachedPaths = {};
        clearMeasurements();

        measure('transpilation');
        // eslint-disable-next-line
        await manager.transpileModules(module);
        const total = endMeasure('transpilation', { silent: true });

        times.push({
          total,
          resolving: getCumulativeMeasure('resolve', { silent: true }),
          esConverting: getCumulativeMeasure('esconvert', { silent: true }),
          transpile: getCumulativeMeasure('transpile', { silent: true }),
        });
      }

      const averageResults = times.reduce(
        (result, entry) => ({
          total: result.total + entry.total / n,
          esConverting: result.esConverting + entry.esConverting / n,
          resolving: result.resolving + entry.resolving / n,
          transpile: result.transpile + entry.transpile / n,
        }),
        { total: 0, esConverting: 0, resolving: 0, transpile: 0 }
      );

      printTranspilationMeasurements(averageResults);
    },
    getLastTranspilationMeasurements() {
      printTranspilationMeasurements({
        total: getMeasurements().transpilation,
        resolving: getCumulativeMeasure('resolve', { silent: true }),
        esConverting: getCumulativeMeasure('esconvert', { silent: true }),
        transpile: getCumulativeMeasure('transpile', { silent: true }),
      });
    },
  };
}
