// @ts-ignore
import StencilWorker from 'worker-loader?publicPath=/&name=stencil-transpiler.[hash:8].worker.js!./stencil-worker.ts';

import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import { TranspilerResult } from '..';

class StencilTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('stencil-loader', StencilWorker, 2);
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return new Promise<TranspilerResult>((resolve, reject) => {
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

const transpiler = new StencilTranspiler();

export { StencilTranspiler };

export default transpiler;
