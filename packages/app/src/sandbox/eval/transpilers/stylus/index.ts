/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
// @ts-ignore
import StylusWorker from 'worker-loader?publicPath=/&name=stylus-transpiler.[hash:8].worker.js!./stylus-worker';
/* eslint-enable import/default */

import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import { TranspilerResult } from '..';

class StylusTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('stylus-loader', StylusWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    return new Promise((resolve, reject) => {
      const { path } = loaderContext;

      this.queueTask(
        {
          code,
          path,
        },
        loaderContext._module.getId(),
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
