// @ts-ignore
import StencilWorker from 'worker-loader?publicPath=/&name=stencil-transpiler.[hash:8].worker.js!./stencil-worker.ts';
import { LoaderContext, TranspilerResult } from 'sandpack-core';

import WorkerTranspiler from '../worker-transpiler';

const DEFAULT_STENCIL_VERSION = '1.2.0-1';

const getStencilVersion = (packageJSON: any) => {
  if (!packageJSON || !packageJSON.parsed) {
    return DEFAULT_STENCIL_VERSION;
  }

  const testVersion = (parsed, keyToCheck): string | undefined =>
    parsed[keyToCheck] && parsed[keyToCheck]['@stencil/core'];

  return (
    testVersion(packageJSON.parsed, 'dependencies') ||
    testVersion(packageJSON.parsed, 'devDependencies') ||
    DEFAULT_STENCIL_VERSION
  );
};

class StencilTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('stencil-loader', StencilWorker, 2);
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return new Promise<TranspilerResult>((resolve, reject) => {
      const path = loaderContext.path;
      const packageJSON = loaderContext.options.configurations.package;

      const stencilVersion = getStencilVersion(packageJSON);

      this.queueTask(
        {
          code,
          path,
          stencilVersion,
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
