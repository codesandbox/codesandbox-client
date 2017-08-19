// @flow
import SassWorker from 'worker-loader!./sass-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../TranspiledModule';

class SassTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(SassWorker, 2);
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const modules = loaderContext.getModules();

    const sassModules = modules.filter(m => m.title.endsWith('scss'));
    const files = sassModules.reduce(
      (interMediateFiles, module) => ({
        ...interMediateFiles,
        [loaderContext.resolvePath(module)]: module.code,
      }),
      {},
    );

    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      this.queueTask(
        {
          files,
          path,
        },
        (err, data) => {
          if (err) {
            loaderContext.emitError(err);

            return reject(err);
          }

          return resolve(data);
        },
      );
    });
  }
}

const transpiler = new SassTranspiler();

export { SassTranspiler };

export default transpiler;
