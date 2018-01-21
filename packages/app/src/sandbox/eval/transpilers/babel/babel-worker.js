// @flow
import flatten from 'lodash/flatten';

import dynamicImportPlugin from './plugins/babel-plugin-dynamic-import-node';
import detective from './plugins/babel-plugin-detective';
import infiniteLoops from './plugins/babel-plugin-transform-prevent-infinite-loops';

import { buildWorkerError } from '../utils/worker-error-handler';
import getDependencies from './get-require-statements';

import { evaluateFromPath, clearCache } from './evaluate';

self.BrowserFS = BrowserFS;

let fsResolve = null;

async function initializeBrowserFS() {
  return new Promise(resolve => {
    if (fsResolve) {
      return resolve(fsResolve);
    }

    fsResolve = resolve;

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

        resolve();
        // BrowserFS is initialized and ready-to-use!
      }
    );
    return;
  });
}

function installPlugin(Babel, BFSRequire, plugin) {
  const fs = BFSRequire('fs');
  const evaluatedPlugin = evaluateFromPath(fs, BFSRequire, plugin);

  Babel.registerPlugin(
    plugin,
    evaluatedPlugin.default ? evaluatedPlugin.default : evaluatedPlugin
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
  registerPlugin: (name: string, plugin: Function) => void,
};

declare var Babel: IBabel;

Babel.registerPlugin('dynamic-import-node', dynamicImportPlugin);
Babel.registerPlugin('babel-plugin-detective', detective);
Babel.registerPlugin(
  'babel-plugin-transform-prevent-infinite-loops',
  infiniteLoops
);

self.addEventListener('message', async event => {
  if (!event.data.codesandbox) {
    return;
  }
  await initializeBrowserFS();
  clearCache();

  const { code, path, config } = event.data;

  config.plugins.filter(p => typeof p === 'string').forEach(p => {
    if (!Babel.availablePlugins[p]) {
      installPlugin(Babel, BrowserFS.BFSRequire, p);
    }
  });

  if (
    flatten(config.plugins).indexOf('transform-vue-jsx') > -1 &&
    Object.keys(Babel.availablePlugins).indexOf('transform-vue-jsx') === -1
  ) {
    const vuePlugin = await import(/* webpackChunkName: 'babel-plugin-transform-vue-jsx' */ 'babel-plugin-transform-vue-jsx');
    Babel.registerPlugin('transform-vue-jsx', vuePlugin);
  }

  if (
    flatten(config.plugins).indexOf('jsx-pragmatic') > -1 &&
    Object.keys(Babel.availablePlugins).indexOf('jsx-pragmatic') === -1
  ) {
    const pragmaticPlugin = await import(/* webpackChunkName: 'babel-plugin-jsx-pragmatic' */ 'babel-plugin-jsx-pragmatic');
    Babel.registerPlugin('jsx-pragmatic', pragmaticPlugin);
  }

  const plugins = [
    ...config.plugins,
    'dynamic-import-node',
    'babel-plugin-transform-prevent-infinite-loops',
    ['babel-plugin-detective', { source: true, nodes: true }],
  ];

  const customConfig = {
    ...config,
    plugins,
  };

  try {
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
