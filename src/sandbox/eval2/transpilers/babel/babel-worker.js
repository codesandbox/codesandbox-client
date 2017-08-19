// @flow

import dynamicImportPlugin from 'babel-plugin-dynamic-import-node';

import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js',
]);

self.postMessage('ready');

declare var Babel: {
  transform: (
    code: string,
    config: Object,
  ) => {
    ast: Object,
    code: string,
  },
  registerPlugin: (name: string, plugin: Function) => void,
};

Babel.registerPlugin('dynamic-import-node', dynamicImportPlugin);

self.addEventListener('message', event => {
  const { code, path, config } = event.data;

  try {
    const { code: compiledCode } = Babel.transform(code, config);

    self.postMessage({
      type: 'compiled',
      transpiledCode: compiledCode,
    });
  } catch (e) {
    e.message = e.message.replace('unknown', path);
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
