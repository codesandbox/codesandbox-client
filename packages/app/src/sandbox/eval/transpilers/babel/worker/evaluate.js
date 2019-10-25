import resolve from 'browser-resolve';
import hashsum from 'hash-sum';
import * as events from 'events';
import * as util from 'util';
import { dirname, basename } from 'path';
import type FSType from 'fs';
import detectOldBrowser from '@codesandbox/common/lib/detect-old-browser';
import evaluateCode from '../../../loaders/eval';

let cache = {};
let cachedPaths = {};
let transpileBeforeExec = detectOldBrowser();

export const resetCache = () => {
  cache = {};
  cachedPaths = {};
  transpileBeforeExec = detectOldBrowser();
};

export default function evaluate(
  fs: FSType,
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

    if (requirePath === 'stream') {
      return {};
    }

    if (requirePath === 'constants') {
      return {};
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

    const requiredNativeModule = BFSRequire(requirePath);

    if (requiredNativeModule) {
      return requiredNativeModule;
    }

    const plugin =
      availablePlugins[requirePath] ||
      availablePlugins[requirePath.replace('babel-plugin-', '')] ||
      availablePlugins[requirePath.replace('@babel/plugin-', '')];
    if (plugin && requirePath !== 'react') {
      return plugin;
    }

    const preset =
      availablePresets[requirePath] ||
      availablePresets[requirePath.replace('babel-preset-', '')] ||
      availablePresets[requirePath.replace('@babel/preset-', '')];
    if (preset && requirePath !== 'react') {
      return preset;
    }

    const dirName = dirname(path);
    cachedPaths[dirName] = cachedPaths[dirName] || {};

    const resolvedPath =
      cachedPaths[dirName][requirePath] ||
      resolve.sync(requirePath, {
        filename: path,
        extensions: ['.js', '.json'],
        moduleDirectory: ['node_modules'],
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

  if (transpileBeforeExec) {
    const { code: transpiledCode } = self.Babel.transform(finalCode, {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: [
        'transform-async-to-generator',
        'transform-object-rest-spread',
        'transform-decorators-legacy',
        'transform-class-properties',
        // Polyfills the runtime needed for async/await and generators
        [
          'transform-runtime',
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
          },
        ],
        [
          'transform-regenerator',
          {
            // Async functions are converted to generators by babel-preset-env
            async: false,
          },
        ],
      ],
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
  fs: FSType,
  BFSRequire: Function,
  path: string,
  currentPath: string,
  availablePlugins: Object,
  availablePresets: Object
) {
  const resolvedPath = resolve.sync(path, {
    filename: currentPath,
    extensions: ['.js', '.json'],
    moduleDirectory: ['node_modules'],
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
