// @flow
import type { Module, Sandbox } from 'common/types';

import TypeScriptWorker from 'worker-loader!./typescript-worker.js';
import getModulePath from 'common/sandbox/get-module-path';

import WorkerTranspiler from '../worker-transpiler';

class TypeScriptTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(TypeScriptWorker);
  }

  test = (module: Module) => /\.tsx?/.test(module.title);

  doTranspilation(sandbox: Sandbox, module: Module) {
    return new Promise((resolve, reject) => {
      const path = getModulePath(
        sandbox.modules,
        sandbox.directories,
        module.id,
      ).replace('/', '');

      this.executeTask(
        {
          code: module.code,
          path,
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

const transpiler = new TypeScriptTranspiler();

export { TypeScriptTranspiler };

export default transpiler;
