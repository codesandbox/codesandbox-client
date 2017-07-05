// @flow
import { transform } from 'babel-standalone';

import type { Module, Directory } from 'common/types';

import evalModule from '../';
import resolveModule from '../../utils/resolve-module';
import DependencyNotFoundError from '../../errors/dependency-not-found-error';
import resolveDependency from './dependency-resolver';
import getBabelConfig from './babel-parser';

const moduleCache = new Map();

/**
 * Deletes the cache of all modules that use module and module itself
 */
export function deleteCache(module: Module) {
  moduleCache.forEach(value => {
    if (value.requires.includes(module.id)) {
      deleteCache(value.module);
    }
  });
  moduleCache.delete(module.id);
}

const compileCode = (
  code: string = '',
  moduleName: string = 'unknown',
  babelConfig: Object,
) => {
  try {
    return transform(code, babelConfig).code;
  } catch (e) {
    e.message = e.message.split('\n')[0].replace('unknown', moduleName);
    throw e;
  }
};

function evaluate(code, require) {
  const module = { exports: {} };
  const exports = {};
  const process = { env: { NODE_ENV: 'development' } }; // eslint-disable-line no-unused-vars
  eval(code); // eslint-disable-line no-eval

  // Choose either the export of __esModule or node
  return Object.keys(exports).length > 0 ? exports : module.exports;
}

export default function evaluateJS(
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: { [path: string]: string },
  depth: number,
) {
  try {
    const requires = [];
    require = function require(path: string) {
      // eslint-disable-line no-unused-vars
      if (/^(\w|@)/.test(path)) {
        // So it must be a dependency
        const dependency = resolveDependency(path, externals);
        if (dependency) return dependency;

        throw new DependencyNotFoundError(path);
      } else {
        const module = resolveModule(
          path,
          modules,
          directories,
          mainModule.directoryShortid,
        );
        if (mainModule === module) {
          throw new Error(`${mainModule.title} is importing itself`);
        }

        if (!module) throw new Error(`Cannot find module in path: ${path}`);

        requires.push(module.id);
        // Check if this module has been evaluated before, if so return that
        const cache = moduleCache.get(module.id);

        return cache
          ? cache.exports
          : evalModule(module, modules, directories, externals, depth + 1);
      }
    };

    const babelConfig = getBabelConfig(
      mainModule,
      modules,
      directories,
      externals,
      depth,
    );
    const compiledCode = compileCode(
      mainModule.code || '',
      mainModule.title,
      babelConfig,
    );

    // don't use Function() here since it changes source locations
    const exports = evaluate(compiledCode, require);

    // Always set a (if no error) new cache for this module, because we know this changed
    moduleCache.set(mainModule.id, {
      exports,
      requires,
      module: mainModule,
    });
    return exports;
  } catch (e) {
    // Remove cache
    moduleCache.delete(mainModule.id);
    throw e;
  }
}
