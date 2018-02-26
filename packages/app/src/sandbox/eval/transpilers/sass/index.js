// @flow
import SassWorker from 'worker-loader?name=sass-transpiler.[hash].worker.js!./sass-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class SassTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('sass-loader', SassWorker, 1, { hasFS: true });

    this.cacheable = false;
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<{ transpiledCode: string }> {
    const extension =
      typeof loaderContext.options.indentedSyntax === 'undefined'
        ? 'scss'
        : 'sass';

    const customPath = loaderContext.path + '.' + extension;

    return new Promise((resolve, reject) => {
      if (code === '' || code == null) {
        resolve({ transpiledCode: '' });
        return;
      }

      this.queueTask(
        {
          code,
          path: customPath,
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

const transpiler = new SassTranspiler();

export { SassTranspiler };

export default transpiler;
