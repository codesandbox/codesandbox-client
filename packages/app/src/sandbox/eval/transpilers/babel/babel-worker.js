// @flow

import flatten from 'lodash/flatten';

import dynamicImportPlugin from './plugins/babel-plugin-dynamic-import-node';
import detective from './plugins/babel-plugin-detective';
import infiniteLoops from './plugins/babel-plugin-transform-prevent-infinite-loops';

import { buildWorkerError } from '../utils/worker-error-handler';
import getDependencies from './get-require-statements';
import downloadPlugins from './download-plugin';

self.importScripts(['https://unpkg.com/@babel/standalone/babel.min.js']);

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
  const { code, path, config } = event.data;

  await downloadPlugins(Babel, ['babel-plugin-preval'], {
    'babel-plugin-preval': '1.6.3',
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
    ['babel-plugin-detective', { source: true, nodes: true }],
    'babel-plugin-transform-prevent-infinite-loops',
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
