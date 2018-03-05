// @flow
import flatten from 'lodash/flatten';

import delay from 'common/utils/delay';

import dynamicImportPlugin from './plugins/babel-plugin-dynamic-import-node';
import detective from './plugins/babel-plugin-detective';
import infiniteLoops from './plugins/babel-plugin-transform-prevent-infinite-loops';
import dynamicCSSModules from './plugins/babel-plugin-dynamic-css-modules';

import { buildWorkerError } from '../utils/worker-error-handler';
import getDependencies from './get-require-statements';

import { evaluateFromPath, resetCache } from './evaluate';

self.BrowserFS = BrowserFS;

let fsInitialized = false;

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

async function installPlugin(Babel, BFSRequire, plugin, currentPath) {
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
    evaluatedPlugin = evaluateFromPath(
      fs,
      BFSRequire,
      `babel-plugin-${plugin}`,
      currentPath,
      Babel.availablePlugins,
      Babel.availablePresets
    );
  }

  if (!evaluatedPlugin) {
    throw new Error(`Could not install plugin '${plugin}', it is undefined.`);
  }

  Babel.registerPlugin(
    plugin,
    evaluatedPlugin.default ? evaluatedPlugin.default : evaluatedPlugin
  );
}

async function installPreset(Babel, BFSRequire, preset, currentPath) {
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
    evaluatedPreset = evaluateFromPath(
      fs,
      BFSRequire,
      `babel-preset-${preset}`,
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
    ? '/static/js/babel.6.26.js'
    : '/static/js/babel.6.26.min.js'
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
};

declare var Babel: IBabel;

Babel.registerPreset('env', Babel.availablePresets.latest);

Babel.registerPlugin('dynamic-import-node', dynamicImportPlugin);
Babel.registerPlugin('babel-plugin-detective', detective);
Babel.registerPlugin('dynamic-css-modules', dynamicCSSModules);
Babel.registerPlugin(
  'babel-plugin-transform-prevent-infinite-loops',
  infiniteLoops
);

self.addEventListener('message', async event => {
  if (!event.data.codesandbox) {
    return;
  }

  if (event.data.type === 'initialize-fs') {
    initializeBrowserFS();
    return;
  }
  resetCache();

  const { code, path, sandboxOptions, config, loaderOptions } = event.data;

  const flattenedPresets = flatten(config.presets);
  const flattenedPlugins = flatten(config.plugins);
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

  try {
    await Promise.all(
      flattenedPlugins
        .filter(p => typeof p === 'string')
        .map(p => p.replace('babel-plugin-', ''))
        .map(async p => {
          if (!Babel.availablePlugins[p]) {
            try {
              await installPlugin(Babel, BrowserFS.BFSRequire, p, path);
            } catch (e) {
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
        .map(p => p.replace('babel-preset-', ''))
        .map(async p => {
          if (!Babel.availablePresets[p]) {
            try {
              await installPreset(Babel, BrowserFS.BFSRequire, p, path);
            } catch (e) {
              throw new Error(
                `Could not find/install babel preset '${p}': ${e.message}`
              );
            }
          }
        })
    );

    const plugins = [...config.plugins, 'dynamic-import-node'];

    if (loaderOptions.dynamicCSSModules) {
      plugins.push('dynamic-css-modules');
    }

    plugins.push(['babel-plugin-detective', { source: true, nodes: true }]);

    if (!sandboxOptions || sandboxOptions.infiniteLoopProtection) {
      plugins.push('babel-plugin-transform-prevent-infinite-loops');
    }

    const customConfig = {
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
      type: 'compiled',
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
