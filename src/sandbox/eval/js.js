// @flow

import { transform } from 'babel-standalone';

import asyncPlugin from 'babel-plugin-transform-async-to-generator';
import restSpread from 'babel-plugin-transform-object-rest-spread';
import classProperties from 'babel-plugin-transform-class-properties';

import evalModule from './';
import resolveModule from '../utils/resolve-module';
import DependencyNotFoundError from '../errors/dependency-not-found-error';

const moduleCache = new Map();

const getId = (sandboxId, module) => `${sandboxId}${module.id}`;

/**
 * Deletes the cache of all modules that use module and module itself
 */
export function deleteCache(sandboxId, module) {
  moduleCache.forEach(value => {
    if (value.requires.includes(getId(sandboxId, module))) {
      deleteCache(sandboxId, value.module);
    }
  });
  moduleCache.delete(getId(sandboxId, module));
}

const compileCode = (code: string = '', moduleName: string = 'unknown') => {
  try {
    return transform(code, {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: [asyncPlugin, restSpread, classProperties],
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

export default function evaluateJS(
  mainModule,
  sandboxId,
  modules,
  directories,
  manifest,
  depth
) {
  try {
    const requires = [];
    require = function require(path: string) {
      // eslint-disable-line no-unused-vars
      if (/^\w/.test(path)) {
        // So it must be a dependency
        const dependencyManifest = manifest[path] || manifest[`${path}.js`];
        if (dependencyManifest) {
          return window.dependencies(dependencyManifest.id);
        } else {
          throw new DependencyNotFoundError(path);
        }
      } else {
        const module = resolveModule(
          path,
          modules,
          directories,
          mainModule.directoryShortid
        );
        if (mainModule === module) {
          throw new Error(`${mainModule.title} is importing itself`);
        }

        if (!module) throw new Error(`Cannot find module in path: ${path}`);

        requires.push(getId(sandboxId, module));
        // Check if this module has been evaluated before, if so return that
        const cache = moduleCache.get(getId(sandboxId, module));

        return cache
          ? cache.exports
          : evalModule(
              module,
              sandboxId,
              modules,
              directories,
              manifest,
              depth + 1
            );
      }
    };

    const compiledCode = compileCode(mainModule.code, mainModule.title);

    // don't use Function() here since it changes source locations
    const exports = evaluate(compiledCode, require);

    // Always set a (if no error) new cache for this module, because we know this changed
    moduleCache.set(getId(sandboxId, mainModule), {
      exports,
      requires,
      module: mainModule,
    });
    return exports;
  } catch (e) {
    // Remove cache
    moduleCache.delete(getId(sandboxId, mainModule));
    throw e;
  }
}
