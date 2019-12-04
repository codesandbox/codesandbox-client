/* eslint-disable import/default */
// @ts-ignore
import PugWorker from 'worker-loader?publicPath=/&name=pug-transpiler.[hash:8].worker.js!./pug-worker';
/* eslint-enable import/default */

import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import { TranspilerResult } from '..';

class PugTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('pug-loader', PugWorker, 1);

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

const transpiler = new PugTranspiler();

export { PugTranspiler };

export default transpiler;
