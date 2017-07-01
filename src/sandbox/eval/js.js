// @flow

import { transform } from 'babel-standalone';

import asyncPlugin from 'babel-plugin-transform-async-to-generator';
import restSpread from 'babel-plugin-transform-object-rest-spread';
import classProperties from 'babel-plugin-transform-class-properties';
import decoratorPlugin from 'babel-plugin-transform-decorators-legacy';

import type { Module, Directory } from 'common/types';

import evalModule from './';
import resolveModule from '../utils/resolve-module';
import DependencyNotFoundError from '../errors/dependency-not-found-error';

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

const compileCode = (code: string = '', moduleName: string = 'unknown') => {
  try {
    return transform(code, {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: [decoratorPlugin, asyncPlugin, restSpread, classProperties],
      retainLines: true,
    }).code;
  } catch (e) {
    e.message = e.message.split('\n')[0].replace('unknown', moduleName);
    throw new Error(e);
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
  externals: Object,
  depth: number,
) {
  try {
    const requires = [];
    require = function require(path: string) {
      // eslint-disable-line no-unused-vars
      if (/^(\w|@)/.test(path)) {
        // So it must be a dependency
        const dependencyModule = externals[path] || externals[`${path}.js`];
        if (dependencyModule) {
          const idMatch = dependencyModule.match(/dll_bundle\((\d+)\)/);
          if (idMatch && idMatch[1]) {
            try {
              return window.dll_bundle(idMatch[1]);
            } catch (e) {
              // Delete the cache of the throwing dependency
              delete window.dll_bundle.c[idMatch[1]];
              throw e;
            }
          }
        }

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

    const compiledCode = compileCode(mainModule.code || '', mainModule.title);

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
