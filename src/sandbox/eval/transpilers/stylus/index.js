// @flow
import StylusWorker from 'worker-loader!./stylus-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class StylusTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('stylus-loader', StylusWorker, 1);

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

const transpiler = new StylusTranspiler();

export { StylusTranspiler };

export default transpiler;
