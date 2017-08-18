// @flow
import type { Module, Sandbox } from 'common/types';

import TypeScriptWorker from 'worker-loader!./typescript-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import TranspileModule, { type LoaderContext } from '../../TranspileModule';

class TypeScriptTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(TypeScriptWorker);
  }

  doTranspilation(
    sandbox: Sandbox,
    module: TranspileModule,
    loaderContext: LoaderContext,
  ) {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      this.executeTask(
        {
          code: module.module.code,
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
