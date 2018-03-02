// @flow

import HTMLWorker from 'worker-loader?name=parcel-html-transpiler.[hash].worker.js!./html-worker.js';
import type { LoaderContext } from '../../../transpiled-module';
import WorkerTranspiler from '../../../transpilers/worker-transpiler';

class HTMLTranspiler extends WorkerTranspiler {
  constructor() {
    super('html-loader', HTMLWorker, 1);

    this.HMREnabled = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext): Promise<null> {
    return new Promise((resolve, reject) => {
      this.queueTask(
        {
          code,
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

const transpiler = new HTMLTranspiler();

export { HTMLTranspiler };

export default transpiler;
