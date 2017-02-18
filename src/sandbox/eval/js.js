import { transform } from 'babel-standalone';
import evalModule from './';
import resolveModule from '../utils/resolve-module';

const moduleCache = new Map();

export function deleteCache(module) {
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

export default function evaluateJS(mainModule, modules, directories, manifest, depth) {
  try {
    require = function require(path) { // eslint-disable-line no-unused-vars
      const dependencyManifest = manifest[path] || manifest[`${path}.js`];
      if (dependencyManifest) return window.dependencies(dependencyManifest.id);

      const module = resolveModule(path, modules, directories, mainModule.directoryId);
      if (mainModule === module) throw new Error(`${mainModule.title} is importing itself`);
      if (!module) throw new Error(`Cannot find module in path: ${path}`);

      // Check if this module has been evaluated before, if so return that
      return moduleCache.get(module.id) ||
        evalModule(module, modules, directories, manifest, depth + 1);
    };

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
}
