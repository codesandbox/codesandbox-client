import { transform } from 'babel-standalone';
import evalModule from './';
import resolveModule from '../utils/resolve-module';
import DependencyNotFoundError from '../errors/dependency-not-found-error';

const moduleCache = new Map();

/**
 * Deletes the cache of all modules that use module and module itself
 */
export function deleteCache(module) {
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
  modules,
  directories,
  manifest,
  depth
) {
  try {
    const requires = [];
    require = function require(path: string) {
      // eslint-disable-line no-unused-vars
      if (path.startsWith('./')) {
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

        requires.push(module.id);
        // Check if this module has been evaluated before, if so return that
        const cache = moduleCache.get(module.id);

        return cache
          ? cache.exports
          : evalModule(module, modules, directories, manifest, depth + 1);
      }

      // So it must be a dependency
      const dependencyManifest = manifest[path] || manifest[`${path}.js`];
      if (dependencyManifest) {
        return window.dependencies(dependencyManifest.id);
      } else {
        throw new DependencyNotFoundError(path);
      }
    };

    const compiledCode = compileCode(mainModule.code, mainModule.title);

    // don't use Function() here since it changes source locations
    const exports = evaluate(compiledCode, require);

    // Always set a (if no error) new cache for this module, because we know this changed
    moduleCache.set(mainModule.id, { exports, module: mainModule, requires });
    return exports;
  } catch (e) {
    // Remove cache
    moduleCache.delete(mainModule.id);
    throw e;
  }
}
