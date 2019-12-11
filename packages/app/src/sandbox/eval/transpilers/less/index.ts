/* eslint-disable import/default */
// @ts-ignore
import LessWorker from 'worker-loader?publicPath=/&name=less-transpiler.[hash:8].worker.js!./less-worker';
/* eslint-enable import/default */

import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import { TranspilerResult } from '..';

class LessTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('less-loader', LessWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
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

      const { path } = loaderContext;
      files[path] = code;

      this.queueTask(
        {
          code,
          files,
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

const transpiler = new LessTranspiler();

export { LessTranspiler };

export default transpiler;
