// @flow
import SassWorker from 'worker-loader?name=sass-transpiler.[hash].worker.js!./sass-worker.js';

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
    const extension =
      typeof loaderContext.options.indentedSyntax === 'undefined'
        ? 'scss'
        : 'sass';

    const customPath = loaderContext.path + '.' + extension;

    const files = modules.reduce(
      (interMediateFiles, module) => ({
        ...interMediateFiles,
        [module.path]: module.code,
      }),
      {}
    );

    files[customPath] = code;
    // TODO fix file finding, make use of content

    return new Promise((resolve, reject) => {
      const path = customPath;

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
