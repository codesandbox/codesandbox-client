import hashsum from 'hash-sum';
import * as events from 'events';
import * as crypto from 'crypto';
import * as util from 'util';
import { dirname, basename } from 'path';
import isESModule from 'sandbox/eval/utils/is-es-module';
import evaluateCode from 'sandpack-core/lib/runner/eval';

import { patchedResolve } from './utils/resolvePatch';
import { getBabelTypes } from './utils/babelTypes';

let cache = {};
let cachedPaths = {};
let transpileBeforeExec = false;

export const resetCache = () => {
  cache = {};
  cachedPaths = {};
};

export default function evaluate(
  fs: any,
  BFSRequire: Function,
  code: string,
  path = '/',
  availablePlugins,
  availablePresets
) {
  const require = (requirePath: string) => {
    if (requirePath === 'events') {
      return events;
    }

    if (requirePath === 'util') {
      return util;
    }

    if (requirePath === 'assert') {
      return () => {};
    }

    if (requirePath === 'crypto') {
      return crypto;
    }

    if (requirePath === 'stream') {
      return {};
    }

    if (requirePath === 'constants') {
      return {};
    }

    if (requirePath === 'os') {
      return {
        homedir() {
          return '/';
        },
      };
    }

    if (requirePath === 'module') {
      return {};
    }

    if (requirePath === 'resolve') {
      return patchedResolve();
    }

    if (requirePath === 'babel-register') {
      transpileBeforeExec = true;
      return () => {};
    }

    if (requirePath === 'require-from-string') {
      return (newCode: string, sourcePath: string) =>
        evaluate(
          fs,
          BFSRequire,
          newCode,
          sourcePath,
          availablePlugins,
          availablePresets
        );
    }

    if (requirePath === '@babel/types') {
      return getBabelTypes();
    }

    const requiredNativeModule = BFSRequire(requirePath);

    if (requiredNativeModule) {
      return requiredNativeModule;
    }

    const plugin =
      availablePlugins[requirePath] ||
      availablePlugins[requirePath.replace('babel-plugin-', '')] ||
      availablePlugins[requirePath.replace('@babel/plugin-', '')];

    if (plugin && requirePath !== 'react') {
      // Babel has exports as esmodule, but the plugins are not registered that way sadly
      if (requirePath.startsWith('@babel/plugin')) {
        return { __esModule: true, default: plugin };
      }
      return plugin;
    }

    const preset =
      availablePresets[requirePath] ||
      availablePresets[requirePath.replace('babel-preset-', '')] ||
      availablePresets[requirePath.replace('@babel/preset-', '')];
    if (preset && requirePath !== 'react') {
      // Babel has exports as esmodule, but the plugins are not registered that way sadly. However, we register
      // @babel/preset-env ourselves, so in that case we need to ignore that. We register @babel/preset-env to
      // also export helper functions of the preset, to support vue.
      if (
        requirePath.startsWith('@babel/preset') &&
        requirePath !== '@babel/preset-env'
      ) {
        return { __esModule: true, default: preset };
      }
      return preset;
    }

    const dirName = dirname(path);
    cachedPaths[dirName] = cachedPaths[dirName] || {};

    const resolvedPath =
      cachedPaths[dirName][requirePath] ||
      patchedResolve().sync(requirePath, {
        filename: path === '/' ? '/index.js' : path,
        extensions: ['.cjs', '.js', '.json'],
      });

    cachedPaths[dirName][requirePath] = resolvedPath;

    const resolvedCode = fs.readFileSync(resolvedPath).toString();
    const id = hashsum(resolvedCode + resolvedPath);

    if (cache[id]) {
      return cache[id].exports;
    }

    cache[id] = {};

    return evaluate(
      fs,
      BFSRequire,
      resolvedCode,
      resolvedPath,
      availablePlugins,
      availablePresets
    );
  };

  // require.resolve is often used in .babelrc configs to resolve the correct plugin path,
  // we want to return a function for that, because our babelrc configs don't really understand
  // strings as plugins.
  require.resolve = requirePath => requirePath;

  const id = hashsum(code + path);
  cache[id] = {
    id: path,
    exports: {},
  };

  let finalCode = code;
  if (path.endsWith('.json')) {
    finalCode = `module.exports = JSON.parse(${JSON.stringify(code)})`;
  }
  finalCode += `\n//# sourceURL=${location.origin}${path}`;

  if (transpileBeforeExec || isESModule(finalCode)) {
    // @ts-ignore
    const { code: transpiledCode } = self.Babel.transform(finalCode, {
      presets: ['env'],
    });

    finalCode = transpiledCode;
  }

  const exports = evaluateCode(
    finalCode,
    require,
    cache[id],
    {
      VUE_CLI_BABEL_TRANSPILE_MODULES: true,
    },
    { __dirname: dirname(path), __filename: basename(path) }
  );

  return exports;
}

export function evaluateFromPath(
  fs: any,
  BFSRequire: Function,
  path: string,
  currentPath: string,
  availablePlugins: Object,
  availablePresets: Object
) {
  const resolvedPath = patchedResolve().sync(path, {
    filename: currentPath,
    extensions: ['.cjs', '.js', '.json'],
  });

  const code = fs.readFileSync(resolvedPath).toString();

  return evaluate(
    fs,
    BFSRequire,
    code,
    resolvedPath,
    availablePlugins,
    availablePresets
  );
}
