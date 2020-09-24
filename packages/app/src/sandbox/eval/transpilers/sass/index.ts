// @ts-ignore
import SassWorker from 'worker-loader?publicPath=/&name=sass-transpiler.[hash:8].worker.js!./worker';

import { LoaderContext, TranspilerResult } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler';

class SassTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('sass-loader', SassWorker, 1, { hasFS: true });

    this.cacheable = false;
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    if (!code) {
      return Promise.resolve({ transpiledCode: '' });
    }

    const indentedSyntax =
      loaderContext.options.indentedSyntax == null
        ? loaderContext.path.endsWith('.sass')
        : true;

    return new Promise((resolve, reject) => {
      if (code === '' || code == null) {
        resolve({ transpiledCode: '' });
        return;
      }

      this.queueTask(
        {
          code,
          path: loaderContext.path,
          indentedSyntax,
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

const transpiler = new SassTranspiler();

export { SassTranspiler };

export default transpiler;
