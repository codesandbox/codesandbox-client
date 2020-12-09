/* eslint-disable global-require, no-console, no-use-before-define */
import { flatten } from 'lodash-es';
import codeFrame from 'babel-code-frame';
import refreshBabelPlugin from 'react-refresh/babel';
import chainingPlugin from '@babel/plugin-proposal-optional-chaining';
import coalescingPlugin from '@babel/plugin-proposal-nullish-coalescing-operator';
import * as envPreset from '@babel/preset-env';

import delay from '@codesandbox/common/lib/utils/delay';

import getDependencyName from 'sandbox/eval/utils/get-dependency-name';
import { join } from '@codesandbox/common/lib/utils/path';
import patchedMacrosPlugin from './utils/macrosPatch';
import detective from './plugins/babel-plugin-detective';
import infiniteLoops from './plugins/babel-plugin-transform-prevent-infinite-loops';
import dynamicCSSModules from './plugins/babel-plugin-dynamic-css-modules';
import renameImport from './plugins/babel-plugin-rename-imports';

import { buildWorkerError } from '../../utils/worker-error-handler';
import getDependencies from './get-require-statements';
import { downloadFromError, downloadPath } from './dynamic-download';
import { getModulesFromMainThread } from '../../utils/fs';

import { evaluateFromPath, resetCache } from './evaluate';
import {
  getPrefixedPluginName,
  getPrefixedPresetName,
} from './get-prefixed-name';
import { patchedResolve } from './utils/resolvePatch';
import { loadBabelTypes } from './utils/babelTypes';

let fsInitialized = false;
let fsLoading = false;
let lastConfig = null;

const IGNORED_MODULES = ['util', 'os'];
const { BrowserFS } = self;

// Default in memory
BrowserFS.configure({ fs: 'InMemory' }, () => {});

self.process = {
  env: { NODE_ENV: 'development', BABEL_ENV: 'development' },
  platform: 'linux',
  argv: [],
  stderr: {},
};
// This one is called from the babel transpiler and babel-plugin-macros
self.require = path => {
  if (path === 'resolve') {
    return patchedResolve();
  }

  if (path === 'assert') {
    return require('assert');
  }

  if (path === 'tty') {
    return {
      isatty() {
        return false;
      },
    };
  }

  if (path === 'util') {
    return require('util');
  }

  if (path === 'os') {
    const os = require('os-browserify');
    os.homedir = () => '/home/sandbox';
    return os;
  }

  const module = BrowserFS.BFSRequire(path);
  if (module) {
    return module;
  }

  if (IGNORED_MODULES.indexOf(path) > -1) {
    return {};
  }

  const fs = BrowserFS.BFSRequire('fs');
  return evaluateFromPath(
    fs,
    BrowserFS.BFSRequire,
    path,
    '/node_modules/babel-plugin-macros/index.js',
    Babel.availablePlugins,
    Babel.availablePresets
  );
};

async function initializeBrowserFS() {
  fsLoading = true;

  const modules = await getModulesFromMainThread();
  const tModules = {};
  modules.forEach(module => {
    tModules[module.path] = { module };
  });

  const bfsWrapper = {
    getTranspiledModules: () => tModules,
    addModule: () => {},
    removeModule: () => {},
    moveModule: () => {},
    updateModule: () => {},
  };

  return new Promise(resolve => {
    BrowserFS.configure(
      {
        fs: 'OverlayFS',
        options: {
          writable: { fs: 'InMemory' },
          readable: {
            fs: 'CodeSandboxFS',
            options: {
              manager: bfsWrapper,
            },
          },
        },
      },
      e => {
        if (e) {
          console.error(e);
          return;
        }
        fsLoading = false;
        fsInitialized = true;
        resolve();
        // BrowserFS is initialized and ready-to-use!
      }
    );
  });
}

async function waitForFs() {
  if (!fsInitialized) {
    if (!fsLoading) {
      // We only load the fs when it's needed. The FS is expensive, as we sync all
      // files of the main thread to the worker. We only want to do this if it's really
      // needed.
      await Promise.all([initializeBrowserFS(), loadBabelTypes()]);
    }
    while (!fsInitialized) {
      await delay(50); // eslint-disable-line
    }
  }
}

/**
 * Babel can transform the plugin name to a longer name (eg. styled-jsx -> babel-styled-jsx)
 * We want to know this beforehand, this function will check which one it is
 */
async function resolveDependencyName(
  name: string,
  isV7: boolean,
  isPreset = false
) {
  // styled-jsx/babel -> styled-jsx
  // @babel/plugin-env/package.json -> @babel/plugin-env
  const dependencyName = getDependencyName(name);
  try {
    await downloadPath(join(dependencyName, 'package.json'));

    return name;
  } catch (_e) {
    const prefixedFunction = isPreset
      ? getPrefixedPresetName
      : getPrefixedPluginName;
    // Get the prefixed path, try that
    const prefixedName = prefixedFunction(dependencyName, isV7);

    try {
      await downloadPath(join(prefixedName, 'package.json'));
    } catch (_er) {
      throw new Error(
        `Cannot find plugin '${dependencyName}' or '${prefixedName}'`
      );
    }

    return prefixedName;
  }
}

async function installPlugin(Babel, BFSRequire, plugin, currentPath, isV7) {
  await waitForFs();

  const fs = BFSRequire('fs');

  let evaluatedPlugin = null;

  const pluginName = await resolveDependencyName(plugin, isV7);

  await downloadPath(`/node_modules/${pluginName}`);

  try {
    await downloadPath(pluginName);
    evaluatedPlugin = evaluateFromPath(
      fs,
      BFSRequire,
      pluginName,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  } catch (firstError) {
    console.warn('First time compiling ' + plugin + ' went wrong, got:');
    console.warn(firstError);

    /**
     * We assume that a file is missing in the in-memory file system, and try to download it by
     * parsing the error.
     */
    evaluatedPlugin = await downloadFromError(firstError).then(() => {
      resetCache();
      return installPlugin(Babel, BFSRequire, plugin, currentPath, isV7);
    });
  }

  if (!evaluatedPlugin) {
    throw new Error(`Could not install plugin '${plugin}', it is undefined.`);
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('Downloaded ' + plugin);
  }
  Babel.registerPlugin(
    plugin,
    evaluatedPlugin.default ? evaluatedPlugin.default : evaluatedPlugin
  );

  return evaluatedPlugin;
}

async function installPreset(Babel, BFSRequire, preset, currentPath, isV7) {
  await waitForFs();

  const fs = BFSRequire('fs');

  let evaluatedPreset = null;

  const presetName = await resolveDependencyName(preset, isV7, true);

  try {
    await downloadPath(presetName);
    evaluatedPreset = evaluateFromPath(
      fs,
      BFSRequire,
      presetName,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  } catch (firstError) {
    console.warn('First time compiling ' + preset + ' went wrong, got:');
    console.warn(firstError);

    /**
     * We assume that a file is missing in the in-memory file system, and try to download it by
     * parsing the error.
     */
    evaluatedPreset = await downloadFromError(firstError).then(() => {
      resetCache();
      return installPreset(Babel, BFSRequire, preset, currentPath, isV7);
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('Downloaded ' + preset);
  }
  if (!evaluatedPreset) {
    throw new Error(`Could not install preset '${preset}', it is undefined.`);
  }

  Babel.registerPreset(
    preset,
    evaluatedPreset.default ? evaluatedPreset.default : evaluatedPreset
  );

  return evaluatedPreset;
}

function stripParams(regexp) {
  return p => {
    if (typeof p === 'string') {
      return p.replace(regexp, '');
    }

    if (Array.isArray(p)) {
      const [name, options] = p;
      return [name.replace(regexp, ''), options];
    }

    return p;
  };
}

const pluginRegExp = new RegExp('@babel/plugin-');
const presetRegExp = new RegExp('@babel/preset-');

/**
 * Remove the @babel/plugin- and @babel/preset- as the standalone version of Babel7 doesn't
 * like that
 * @param {} config
 */
function normalizeV7Config(config) {
  return {
    ...config,
    plugins: (config.plugins || []).map(stripParams(pluginRegExp)),
    presets: (config.presets || []).map(stripParams(presetRegExp)),
  };
}

function getCustomConfig(
  { config, codeSandboxPlugins },
  version: number,
  path: string,
  options: Object
) {
  if (
    /^\/node_modules/.test(path) &&
    /\.js$/.test(path) &&
    options.compileNodeModulesWithEnv
  ) {
    if (version === 7) {
      return {
        parserOpts: {
          plugins: ['dynamicImport', 'objectRestSpread'],
        },
        presets: ['env', 'react'],
        plugins: [
          'babel-plugin-csb-rename-import',
          'transform-modules-commonjs',
          'proposal-class-properties',
          '@babel/plugin-transform-runtime',
          ...codeSandboxPlugins,
        ],
      };
    }

    return {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: [
        'babel-plugin-csb-rename-import',
        'transform-es2015-modules-commonjs',
        'transform-class-properties',
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
        ...codeSandboxPlugins,
      ],
    };
  }

  return {
    ...config,
    plugins: config.plugins
      ? [
          'babel-plugin-csb-rename-import',
          ...config.plugins,
          ...codeSandboxPlugins,
        ]
      : codeSandboxPlugins,
  };
}

async function compile(code, customConfig, path, isV7) {
  try {
    let result;
    try {
      result = Babel.transform(code, customConfig);
    } catch (e) {
      e.message = e.message.replace('unknown', path);

      // Match the line+col
      const lineColRegex = /\((\d+):(\d+)\)/;

      const match = e.message.match(lineColRegex);
      if (match && match[1] && match[2]) {
        const lineNumber = +match[1];
        const colNumber = +match[2];

        const niceMessage =
          e.message + '\n\n' + codeFrame(code, lineNumber, colNumber);

        e.message = niceMessage;
      }

      throw e;
    }

    const dependencies = getDependencies(detective.metadata(result));
    if (isV7) {
      // Force push this dependency, there are cases where it isn't included out of our control.
      // https://twitter.com/vigs072/status/1103005932886343680
      // TODO: look into this
      dependencies.push({
        path: '@babel/runtime/helpers/interopRequireDefault',
        type: 'direct',
      });
      dependencies.push({
        path: '@babel/runtime/helpers/interopRequireWildcard',
        type: 'direct',
      });
    }

    dependencies.forEach(dependency => {
      self.postMessage({
        type: 'add-dependency',
        path: dependency.path,
        isGlob: dependency.type === 'glob',
      });
    });

    self.postMessage({
      type: 'result',
      transpiledCode: result.code,
    });
  } catch (e) {
    if (
      !fsInitialized &&
      (e.message.indexOf('Cannot find module') > -1 || e.code === 'EIO')
    ) {
      // BrowserFS was needed but wasn't initialized
      await waitForFs();

      await compile(code, customConfig, path);
    } else if (e.message.indexOf('Cannot find module') > -1) {
      // Try to download the file and all dependencies, retry compilation then
      await downloadFromError(e).then(() => {
        resetCache();
        return compile(code, customConfig, path);
      });
    } else {
      throw e;
    }
  }
}

try {
  // Rollup globals hardcoded in Babel
  self.path$2 = BrowserFS.BFSRequire('path');
  self.fs$1 = BrowserFS.BFSRequire('fs');

  self.importScripts(
    process.env.NODE_ENV === 'development'
      ? `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.7.8.1.js`
      : `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.7.8.1.min.js`
  );
} catch (e) {
  console.error(e);
}

self.postMessage('ready');

export type IBabel = {
  transform: (
    code: string,
    config: Object
  ) => {
    ast: Object,
    code: string,
  },
  availablePlugins: { [key: string]: Function },
  availablePresets: { [key: string]: Function },
  registerPlugin: (name: string, plugin: Function) => void,
  registerPreset: (name: string, preset: Function) => void,
  version: string,
};

declare var Babel: IBabel;

let loadedTranspilerURL = null;
let loadedEnvURL = null;

function registerCodeSandboxPlugins() {
  Babel.registerPlugin('babel-plugin-detective', detective);
  Babel.registerPlugin('dynamic-css-modules', dynamicCSSModules);
  Babel.registerPlugin('babel-plugin-csb-rename-import', renameImport);
  Babel.registerPlugin(
    'babel-plugin-transform-prevent-infinite-loops',
    infiniteLoops
  );
}

function loadCustomTranspiler(babelUrl, babelEnvUrl) {
  if (babelUrl && babelUrl !== loadedTranspilerURL) {
    self.importScripts(babelUrl);
    registerCodeSandboxPlugins();
    loadedTranspilerURL = babelUrl;
  }

  if (babelEnvUrl && babelEnvUrl !== loadedEnvURL) {
    self.importScripts(babelEnvUrl);
    loadedEnvURL = babelEnvUrl;
  }
}

registerCodeSandboxPlugins();

self.addEventListener('message', async event => {
  if (!event.data.codesandbox) {
    return;
  }

  if (event.data.type === 'get-babel-context') {
    const transpilerOptions = event.data.babelTranspilerOptions;
    loadCustomTranspiler(
      transpilerOptions && transpilerOptions.babelURL,
      transpilerOptions && transpilerOptions.babelEnvURL
    );
    self.postMessage({
      type: 'result',
      version: Babel.version,
      availablePlugins: Object.keys(Babel.availablePlugins),
      availablePresets: Object.keys(Babel.availablePresets),
    });
    return;
  }

  const {
    code,
    path,
    sandboxOptions,
    babelTranspilerOptions,
    config,
    loaderOptions,
    version,
    type,
    hasMacros,
  } = event.data;

  if (type !== 'compile' && type !== 'warmup') {
    return;
  }
  try {
    const { disableCodeSandboxPlugins } = loaderOptions;

    const babelUrl = babelTranspilerOptions && babelTranspilerOptions.babelURL;
    const babelEnvUrl =
      babelTranspilerOptions && babelTranspilerOptions.babelEnvURL;

    if (babelUrl || babelEnvUrl) {
      loadCustomTranspiler(babelUrl, babelEnvUrl);
    } else if (version !== 7) {
      loadCustomTranspiler(
        process.env.NODE_ENV === 'development'
          ? `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.6.26.js`
          : `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.6.26.min.js`
      );
    }

    const stringifiedConfig = JSON.stringify(babelTranspilerOptions);
    if (stringifiedConfig && lastConfig !== stringifiedConfig) {
      resetCache();
      lastConfig = stringifiedConfig;
    }

    const codeSandboxPlugins = [];

    if (!disableCodeSandboxPlugins) {
      if (loaderOptions.dynamicCSSModules) {
        codeSandboxPlugins.push('dynamic-css-modules');
      }

      if (!sandboxOptions || sandboxOptions.infiniteLoopProtection) {
        codeSandboxPlugins.push(
          'babel-plugin-transform-prevent-infinite-loops'
        );
      }
    }

    codeSandboxPlugins.push([
      'babel-plugin-detective',
      { source: true, nodes: true, generated: true },
    ]);

    const customConfig = getCustomConfig(
      { config, codeSandboxPlugins },
      version,
      path,
      loaderOptions
    );

    const flattenedPresets = flatten(customConfig.presets || []);
    const flattenedPlugins = flatten(customConfig.plugins || []);

    if (!disableCodeSandboxPlugins) {
      if (
        Object.keys(Babel.availablePresets).indexOf('env') === -1 &&
        version !== 7
      ) {
        Babel.registerPreset('env', Babel.availablePresets.latest);
      }

      if (version === 7) {
        // Hardcode, since we want to override env
        Babel.availablePresets.env = envPreset;
      }

      if (
        (flattenedPlugins.indexOf('transform-vue-jsx') > -1 ||
          flattenedPlugins.indexOf('babel-plugin-transform-vue-jsx') > -1) &&
        Object.keys(Babel.availablePlugins).indexOf('transform-vue-jsx') === -1
      ) {
        const vuePlugin = await import(
          /* webpackChunkName: 'babel-plugin-transform-vue-jsx' */ 'babel-plugin-transform-vue-jsx'
        );
        Babel.registerPlugin('transform-vue-jsx', vuePlugin);
        Babel.registerPlugin('babel-plugin-transform-vue-jsx', vuePlugin);
      }

      if (
        (flattenedPlugins.indexOf('jsx-pragmatic') > -1 ||
          flattenedPlugins.indexOf('babel-plugin-jsx-pragmatic') > -1) &&
        Object.keys(Babel.availablePlugins).indexOf('jsx-pragmatic') === -1
      ) {
        const pragmaticPlugin = await import(
          /* webpackChunkName: 'babel-plugin-jsx-pragmatic' */ 'babel-plugin-jsx-pragmatic'
        );
        Babel.registerPlugin('jsx-pragmatic', pragmaticPlugin);
        Babel.registerPlugin('babel-plugin-jsx-pragmatic', pragmaticPlugin);
      }

      if (
        flattenedPlugins.indexOf('babel-plugin-macros') > -1 &&
        Object.keys(Babel.availablePlugins).indexOf('babel-plugin-macros') ===
          -1
      ) {
        if (hasMacros) {
          await waitForFs();
        }

        Babel.registerPlugin('babel-plugin-macros', patchedMacrosPlugin);
      }

      if (
        (flattenedPlugins.indexOf('proposal-optional-chaining') > -1 ||
          flattenedPlugins.indexOf('@babel/plugin-proposal-optional-chaining') >
            -1) &&
        Object.keys(Babel.availablePlugins).indexOf(
          'proposal-optional-chaining'
        ) === -1
      ) {
        Babel.registerPlugin('proposal-optional-chaining', chainingPlugin);
      }

      if (
        flattenedPlugins.indexOf('react-refresh/babel') > -1 &&
        Object.keys(Babel.availablePlugins).indexOf('react-refresh/babel') ===
          -1
      ) {
        Babel.registerPlugin('react-refresh/babel', refreshBabelPlugin);
      }

      const coalescingInPlugins =
        flattenedPlugins.indexOf('proposal-nullish-coalescing-operator') > -1 ||
        flattenedPlugins.indexOf(
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ) > -1;
      if (
        coalescingInPlugins &&
        Object.keys(Babel.availablePlugins).indexOf(
          'proposal-nullish-coalescing-operator'
        ) === -1
      ) {
        Babel.registerPlugin(
          'proposal-nullish-coalescing-operator',
          coalescingPlugin
        );
      }

      if (
        flattenedPlugins.indexOf('transform-cx-jsx') > -1 &&
        Object.keys(Babel.availablePlugins).indexOf('transform-cx-jsx') === -1
      ) {
        const cxJsxPlugin = await import(
          /* webpackChunkName: 'transform-cx-jsx' */ 'babel-plugin-transform-cx-jsx'
        );
        Babel.registerPlugin('transform-cx-jsx', cxJsxPlugin);
      }
    }

    await Promise.all(
      flattenedPlugins
        .filter(p => typeof p === 'string')
        .map(async p => {
          const normalizedName = p
            .replace('babel-plugin-', '')
            .replace('@babel/plugin-', '');
          if (
            !Babel.availablePlugins[normalizedName] &&
            !Babel.availablePlugins[p]
          ) {
            try {
              await installPlugin(
                Babel,
                BrowserFS.BFSRequire,
                p,
                path,
                !Babel.version.startsWith('6')
              );
            } catch (e) {
              console.warn(e);
              throw new Error(
                `Could not find/install babel plugin '${p}': ${e.message}`
              );
            }
          }
        })
    );

    await Promise.all(
      flattenedPresets
        .filter(p => typeof p === 'string')
        .map(async p => {
          const normalizedName = p
            .replace('babel-preset-', '')
            .replace('@babel/preset-', '');

          if (
            !Babel.availablePresets[normalizedName] &&
            !Babel.availablePresets[p]
          ) {
            try {
              await installPreset(
                Babel,
                BrowserFS.BFSRequire,
                p,
                path,
                !Babel.version.startsWith('6')
              );
            } catch (e) {
              throw new Error(
                `Could not find/install babel preset '${p}': ${e.message}`
              );
            }
          }
        })
    );

    if (type === 'warmup') {
      Babel.transform(code, normalizeV7Config(customConfig));
      return;
    }

    await compile(
      code,
      version === 7 ? normalizeV7Config(customConfig) : customConfig,
      path,
      version === 7
    );
  } catch (e) {
    if (type === 'warmup') {
      return;
    }

    console.error(e);
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
