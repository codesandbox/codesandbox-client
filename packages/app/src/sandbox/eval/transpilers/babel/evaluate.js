import resolve from 'browser-resolve';
import hashsum from 'hash-sum';
import type FSType from 'fs';
import evaluateCode from '../../loaders/eval';

let cache = {};

export const resetCache = () => {
  cache = {};
};

export default function evaluate(
  fs: FSType,
  BFSRequire: Function,
  code: string,
  path = '/'
) {
  const require = (requirePath: string) => {
    if (requirePath === 'require-from-string') {
      return (newCode: string) => evaluate(fs, BFSRequire, newCode, '/');
    }

    const requiredNativeModule = BFSRequire(requirePath);

    if (requiredNativeModule) {
      return requiredNativeModule;
    }

    const resolvedPath = resolve.sync(requirePath, {
      filename: path,
      extensions: ['.js', '.json'],
      moduleDirectory: ['node_modules'],
    });

    const resolvedCode = fs.readFileSync(resolvedPath).toString();
    const id = hashsum(resolvedCode + resolvedPath);

    cache[id] =
      cache[id] || evaluate(fs, BFSRequire, resolvedCode, resolvedPath);

    return cache[id];
  };

  const module = {
    id: path,
    exports: {},
  };

  evaluateCode(
    `${code}\n//# sourceURL=${location.origin}${path}`,
    require,
    module
  );

  return module.exports;
}

export function evaluateFromPath(
  fs: FSType,
  BFSRequire: Function,
  path: string,
  currentPath: string
) {
  const resolvedPath = resolve.sync(path, {
    filename: currentPath,
    extensions: ['.js', '.json'],
    moduleDirectory: ['node_modules'],
  });

  const code = fs.readFileSync(resolvedPath).toString();

  return evaluate(fs, BFSRequire, code, resolvedPath);
}
