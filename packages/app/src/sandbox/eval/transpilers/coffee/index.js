// @flow
import CoffeeWorker from 'worker-loader?publicPath=/&name=coffee-transpiler.[hash:8].worker.js!./coffee-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class CoffeeTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('coffee-loader', CoffeeWorker, 1);

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

const transpiler = new CoffeeTranspiler();

export { CoffeeTranspiler };

export default transpiler;
