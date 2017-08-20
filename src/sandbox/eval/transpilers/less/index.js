// @flow
import LessWorker from 'worker-loader!./less-worker.js';

import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

class LessTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(LessWorker, 1);

    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return new Promise((resolve, reject) => {
      const modules = loaderContext.getModules();

      const lessModules = modules.filter(m => /\.[css|less]/.test(m.title));
      const files = lessModules.reduce(
        (interMediateFiles, module) => ({
          ...interMediateFiles,
          [loaderContext.resolvePath(module)]: module.code,
        }),
        {},
      );

      const path = loaderContext.path;

      this.queueTask(
        {
          code,
          files,
          path,
        },
        (err, data) => {
          if (err) {
            loaderContext.emitError(err);

            return reject(err);
          }

          if (data.type === 'add-dependency') {
            try {
              loaderContext.addDependency(
                data.path,
                loaderContext._module.module.directoryShortid,
              );
            } catch (e) {
              return reject(e);
            }
          } else {
            return resolve(data);
          }
        },
      );
    });
  }
}

const transpiler = new LessTranspiler();

export { LessTranspiler };

export default transpiler;
