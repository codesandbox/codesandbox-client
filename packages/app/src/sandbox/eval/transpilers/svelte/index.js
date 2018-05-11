// @flow
import SvelteWorker from 'worker-loader?publicPath=/&name=svelte-transpiler.[hash:8].worker.js!./svelte-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class SvelteTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('svelte-loader', SvelteWorker, 2);
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

const transpiler = new SvelteTranspiler();

export { SvelteTranspiler };

export default transpiler;
