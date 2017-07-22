// @flow
import { transform } from 'babel-standalone';

import type { Module, Directory } from 'common/types';

import evalModule from '../';
import resolveModule from '../../utils/resolve-module';
import resolveDependency from './dependency-resolver';
import getBabelConfig from './babel-parser';
import transformError from './error-transformer';

export type ModuleCacheModule = {
  requires: Array<string>,
  module: Module,
  exports: Object,
};
const moduleCache: Map<string, ModuleCacheModule> = new Map();

export function clearCache() {
  moduleCache.clear();
}

/**
 * Deletes the cache of all modules that use module and module itself
 */
export function deleteCache(module: Module) {
  // Delete own cache first, because with cyclic dependencies we could get a
  // endless loop
  moduleCache.delete(module.id);
  moduleCache.forEach(value => {
    if (value.requires.includes(module.id)) {
      deleteCache(value.module);
    }
  });
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
  try {
    eval(code); // eslint-disable-line no-eval

    // Choose either the export of __esModule or node
    return Object.keys(exports).length > 0 ? exports : module.exports;
  } catch (e) {
    e.isEvalError = true;

    throw e;
  }
}

/**
 * Transpile & execute a JS file
 * @param {*} mainModule The module to execute
 * @param {*} modules All modules in the sandbox
 * @param {*} directories All directories in the sandbox
 * @param {*} externals A list of dependency with a mapping to dependencPath -> module id
 * @param {*} depth The amount of requires we're deep in
 * @param {*} parentModules If this is a module that's required, the parents that execute it
 *                          are here (so if a requires b and b is executed, this will be [a]).
 *                          This is required for cyclic dependency checks
 */
export default function evaluateJS(
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: { [path: string]: string },
  depth: ?number,
  parentModules: Array<Module>,
) {
  const requires = [];
  try {
    require = function require(path: string) {
      // eslint-disable-line no-unused-vars
      if (/^(\w|@)/.test(path)) {
        // So it must be a dependency
        return resolveDependency(path, externals);
      }

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

      // This is a cyclic dependency, we should return an empty object for first
      // execution according to node spec
      if (parentModules.includes(module) && !cache) {
        return {};
      }

      return cache
        ? cache.exports
        : evalModule(module, modules, directories, externals, depth + 1, [
            ...parentModules,
            mainModule,
          ]);
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

    e.module = e.module || mainModule;

    const newError = transformError(
      e,
      e.module,
      modules,
      moduleCache,
      requires,
    );

    if (newError.module && newError.module !== e.module) {
      deleteCache(newError.module);
    }

    throw newError;
  }
}
