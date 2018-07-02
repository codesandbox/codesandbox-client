// @flow
import { flatten } from 'lodash-es';

import delay from 'common/utils/delay';

import dynamicImportPlugin from './plugins/babel-plugin-dynamic-import-node';
import detective from './plugins/babel-plugin-detective';
import infiniteLoops from './plugins/babel-plugin-transform-prevent-infinite-loops';
import dynamicCSSModules from './plugins/babel-plugin-dynamic-css-modules';

import { buildWorkerError } from '../../utils/worker-error-handler';
import getDependencies from './get-require-statements';

import { evaluateFromPath, resetCache } from './evaluate';
import {
  getPrefixedPluginName,
  getPrefixedPresetName,
} from './get-prefixed-name';

let fsInitialized = false;
let lastConfig = null;

async function initializeBrowserFS() {
  return new Promise(resolve => {
    BrowserFS.configure(
      {
        fs: 'AsyncMirror',
        options: {
          sync: { fs: 'InMemory' },
          async: { fs: 'WorkerFS', options: { worker: self } },
        },
      },
      e => {
        if (e) {
          console.error(e);
          return;
        }
        fsInitialized = true;
        resolve();
        // BrowserFS is initialized and ready-to-use!
      }
    );
  });
}

async function waitForFs() {
  if (!fsInitialized) {
    while (!fsInitialized) {
      await delay(50); // eslint-disable-line
    }
  }
}

async function installPlugin(Babel, BFSRequire, plugin, currentPath, isV7) {
  await waitForFs();

  const fs = BFSRequire('fs');

  let evaluatedPlugin = null;

  try {
    evaluatedPlugin = evaluateFromPath(
      fs,
      BFSRequire,
      plugin,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  } catch (e) {
    console.warn('First time compiling ' + plugin + ' went wrong, got:');
    console.warn(e);
    const prefixedName = getPrefixedPluginName(plugin, isV7);

    evaluatedPlugin = evaluateFromPath(
      fs,
      BFSRequire,
      prefixedName,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );

    console.log('Second try succeeded');
  }

  if (!evaluatedPlugin) {
    throw new Error(`Could not install plugin '${plugin}', it is undefined.`);
  }

  Babel.registerPlugin(
    plugin,
    evaluatedPlugin.default ? evaluatedPlugin.default : evaluatedPlugin
  );
}

async function installPreset(Babel, BFSRequire, preset, currentPath, isV7) {
  await waitForFs();

  const fs = BFSRequire('fs');

  let evaluatedPreset = null;

  try {
    evaluatedPreset = evaluateFromPath(
      fs,
      BFSRequire,
      preset,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  } catch (e) {
    const prefixedName = getPrefixedPresetName(preset, isV7);

    evaluatedPreset = evaluateFromPath(
      fs,
      BFSRequire,
      prefixedName,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  }

  if (!evaluatedPreset) {
    throw new Error(`Could not install preset '${preset}', it is undefined.`);
  }

  Babel.registerPreset(
    preset,
    evaluatedPreset.default ? evaluatedPreset.default : evaluatedPreset
  );
}

self.importScripts(
  process.env.NODE_ENV === 'development'
    ? `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.6.26.js`
    : `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.6.26.min.js`
);

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
  Babel.registerPlugin('dynamic-import-node', dynamicImportPlugin);
  Babel.registerPlugin('babel-plugin-detective', detective);
  Babel.registerPlugin('dynamic-css-modules', dynamicCSSModules);
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

  if (event.data.type === 'initialize-fs') {
    initializeBrowserFS();
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
  } = event.data;

  if (type !== 'compile') {
    return;
  }

  const { disableCodeSandboxPlugins } = loaderOptions;

  const babelUrl = babelTranspilerOptions && babelTranspilerOptions.babelURL;
  const babelEnvUrl =
    babelTranspilerOptions && babelTranspilerOptions.babelEnvURL;

  if (babelUrl || babelEnvUrl) {
    loadCustomTranspiler(babelUrl, babelEnvUrl);
  } else if (version === 7) {
    loadCustomTranspiler(
      process.env.NODE_ENV === 'development'
        ? `${process.env.CODESANDBOX_HOST || ''}/static/js/babel.7.00-beta.js`
        : `${process.env.CODESANDBOX_HOST ||
            ''}/static/js/babel.7.00-beta-1.min.js`
    );
  }

  const stringifiedConfig = JSON.stringify(babelTranspilerOptions);
  if (lastConfig !== stringifiedConfig) {
    resetCache();
    lastConfig = stringifiedConfig;
  }

  const flattenedPresets = flatten(config.presets || []);
  const flattenedPlugins = flatten(config.plugins || []);

  if (!disableCodeSandboxPlugins) {
    if (
      flattenedPresets.indexOf('env') > -1 &&
      Object.keys(Babel.availablePresets).indexOf('env') === -1 &&
      version !== 7
    ) {
      Babel.registerPreset('env', Babel.availablePresets.latest);
    }

    if (
      flattenedPresets.indexOf('env') > -1 &&
      Object.keys(Babel.availablePresets).indexOf('env') === -1 &&
      version === 7
    ) {
      Babel.registerPreset('env', Babel.availablePresets.es2015);
    }

    if (
      flattenedPlugins.indexOf('transform-vue-jsx') > -1 &&
      Object.keys(Babel.availablePlugins).indexOf('transform-vue-jsx') === -1
    ) {
      const vuePlugin = await import(/* webpackChunkName: 'babel-plugin-transform-vue-jsx' */ 'babel-plugin-transform-vue-jsx');
      Babel.registerPlugin('transform-vue-jsx', vuePlugin);
    }

    if (
      flattenedPlugins.indexOf('jsx-pragmatic') > -1 &&
      Object.keys(Babel.availablePlugins).indexOf('jsx-pragmatic') === -1
    ) {
      const pragmaticPlugin = await import(/* webpackChunkName: 'babel-plugin-jsx-pragmatic' */ 'babel-plugin-jsx-pragmatic');
      Babel.registerPlugin('jsx-pragmatic', pragmaticPlugin);
    }

    if (
      flattenedPlugins.indexOf('transform-cx-jsx') > -1 &&
      Object.keys(Babel.availablePlugins).indexOf('transform-cx-jsx') === -1
    ) {
      const cxJsxPlugin = await import(/* webpackChunkName: 'transform-cx-jsx' */ 'babel-plugin-transform-cx-jsx');
      Babel.registerPlugin('transform-cx-jsx', cxJsxPlugin);
    }
  }

  try {
    await Promise.all(
      flattenedPlugins.filter(p => typeof p === 'string').map(async p => {
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
            throw new Error(
              `Could not find/install babel plugin '${p}': ${e.message}`
            );
          }
        }
      })
    );

    await Promise.all(
      flattenedPresets.filter(p => typeof p === 'string').map(async p => {
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

    const plugins = [...(config.plugins || [])];

    if (!disableCodeSandboxPlugins) {
      plugins.push('dynamic-import-node');

      if (loaderOptions.dynamicCSSModules) {
        plugins.push('dynamic-css-modules');
      }

      if (!sandboxOptions || sandboxOptions.infiniteLoopProtection) {
        plugins.push('babel-plugin-transform-prevent-infinite-loops');
      }
    }

    plugins.push([
      'babel-plugin-detective',
      { source: true, nodes: true, generated: true },
    ]);

    const customConfig =
      /^\/node_modules/.test(path) && /\.js$/.test(path)
        ? {
            plugins: [
              version === 7
                ? 'transform-modules-commonjs'
                : 'transform-es2015-modules-commonjs',
              [
                'babel-plugin-detective',
                { source: true, nodes: true, generated: true },
              ],
            ],
          }
        : {
            ...config,
            plugins,
          };

    const result = Babel.transform(code, customConfig);

    const dependencies = getDependencies(detective.metadata(result));

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
    console.error(e);
    e.message = e.message.replace('unknown', path);
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
