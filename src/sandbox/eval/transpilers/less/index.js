// @flow
import LessWorker from 'worker-loader!./less-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class LessTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('less-loader', LessWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return new Promise((resolve, reject) => {
      const modules = loaderContext.getModules();

      const lessModules = modules.filter(m => /\.[css|less]$/.test(m.path));
      const files = lessModules.reduce(
        (interMediateFiles, module) => ({
          ...interMediateFiles,
          [module.path]: module.code,
        }),
        {}
      );

      const path = loaderContext.path;

      this.queueTask(
        {
          code,
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

const transpiler = new LessTranspiler();

export { LessTranspiler };

export default transpiler;
