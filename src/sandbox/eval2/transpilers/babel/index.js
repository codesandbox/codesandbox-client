// @flow
import type { Module, Sandbox } from 'common/types';

import BabelWorker from 'worker-loader!./babel-worker.js';
import getModulePath from 'common/sandbox/get-module-path';

import getBabelConfig from './babel-parser';
import WorkerTranspiler from '../worker-transpiler';

// Right now this is in a worker, but when we're going to allow custom plugins
// we need to move this out of the worker again, because the config needs
// to support custom plugins
class BabelTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(BabelWorker);
  }

  test = (module: Module) => /\.jsx?/.test(module.title);

  doTranspilation(sandbox: Sandbox, module: Module) {
    return new Promise((resolve, reject) => {
      const path = getModulePath(
        sandbox.modules,
        sandbox.directories,
        module.id,
      ).replace('/', '');

      // TODO get custom babel config back in
      const babelConfig = getBabelConfig({}, path);

      this.executeTask(
        {
          code: module.code,
          config: babelConfig,
        },
        (err, data) => {
          if (err) {
            console.error('There was an error we still need to handle', err);
            return reject(err);
          }

          return resolve(data);
        },
      );
    });
  }
}

const transpiler = new BabelTranspiler();

export { BabelTranspiler };

export default transpiler;
