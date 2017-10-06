// @flow
import SassWorker from 'worker-loader!./sass-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class SassTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('sass-loader', SassWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const modules = loaderContext.getModules();

    const sassModules = modules.filter(m => /\.s?[a|c]ss$/.test(m.path));
    const files = sassModules.reduce(
      (interMediateFiles, module) => ({
        ...interMediateFiles,
        [module.path]: module.code,
      }),
      {}
    );

    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      this.queueTask(
        {
          files,
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

const transpiler = new SassTranspiler();

export { SassTranspiler };

export default transpiler;
