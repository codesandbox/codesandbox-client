// @flow
import { transform } from 'babel-standalone';

import type { Module } from '../../app/store/entities/modules/';

import resolveModule from './resolve-module';
import type { Directory } from '../../app/store/entities/directories/index';

const MAX_DEPTH = 20;

const moduleCache = new Map();

const compileCode = (code: string = '', moduleName: string = 'unknown') => {
  try {
    return transform(code, {
      presets: ['es2015', 'react', 'stage-0'],
      retainLines: true,
    }).code;
  } catch (e) {
    e.message = e.message.split('\n')[0].replace('unknown', moduleName);
    throw new Error(e);
  }
};

function evaluate(code, require) {
  const exports = { __esModule: true };
  eval(code); // eslint-disable-line no-eval
  return exports;
}

const evalModule = (
  mainModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  manifest: Object,
  depth: number = 0,
) => {
  require = function require(path) { // eslint-disable-line no-unused-vars
    if (depth > MAX_DEPTH) {
      throw new Error(`Exceeded the maximum require depth of ${MAX_DEPTH}.`);
    }
    const dependencyId = manifest[path] || manifest[`${path}.js`];
    if (dependencyId) return window.dependencies(dependencyId.id);

    const module = resolveModule(path, modules, directories, mainModule.directoryId);
    if (mainModule === module) throw new Error(`${mainModule.title} is importing itself`);
    if (!module) throw new Error(`Cannot find module in path: ${path}`);

    // Check if this module has been evaluated before, if so return that
    return moduleCache.get(module.id) || evalModule(module, modules, directories, manifest, depth + 1);
  };

  try {
    const compiledCode = compileCode(mainModule.code, mainModule.title);
    // don't use Function() here since it changes source locations
    const exports = evaluate(compiledCode, require);

    // Always set a (if no error) new cache for this module, because we know this changed
    moduleCache.set(mainModule.id, exports);
    return exports;
  } catch (e) {
    // Remove cache
    moduleCache.delete(mainModule.id);
    e.module = e.module || mainModule;
    throw e;
  }
};

export default evalModule;
