// @flow
import dynamicImportPlugin from 'babel-plugin-dynamic-import-node';

import { buildWorkerError } from '../worker-transpiler';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js',
]);

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
  const { code, config, id } = event.data;

  try {
    const { code: compiledCode } = Babel.transform(code, config);

    self.postMessage({
      type: 'compiled',
      code: compiledCode,
      id,
    });
  } catch (e) {
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
      id,
    });
  }
});
