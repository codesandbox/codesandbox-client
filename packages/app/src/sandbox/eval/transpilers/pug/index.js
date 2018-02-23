// @flow
import PugWorker from 'worker-loader?name=pug-transpiler.[hash].worker.js!./pug-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class PugTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('pug-loader', PugWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      this.queueTask(
        {
          code,
          path,
        },
        loaderContext,
        (err, data) => {
          if (err) {
            loaderContext.emitError(err);

            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }
}

const transpiler = new PugTranspiler();

export { PugTranspiler };

export default transpiler;
