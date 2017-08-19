// @flow
import TypeScriptWorker from 'worker-loader!./typescript-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import TranspiledModule, { type LoaderContext } from '../../TranspiledModule';

class TypeScriptTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(TypeScriptWorker, 2);
  }

  doTranspilation(module: TranspiledModule, loaderContext: LoaderContext) {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      this.queueTask(
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
