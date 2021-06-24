/* eslint-disable import/default */
// @ts-ignore
import PugWorker from 'worker-loader?publicPath=/&name=pug-transpiler.[hash:8].worker.js!./pug-worker';
/* eslint-enable import/default */

import { LoaderContext, TranspilerResult } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler/transpiler';

class PugTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('pug-loader', PugWorker, {
      maxWorkerCount: 1,
    });

    this.cacheable = false;
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const { path } = loaderContext;
    return this.queueCompileFn(
      {
        code,
        path,
      },
      loaderContext
    );
  }
}

const transpiler = new PugTranspiler();

export { PugTranspiler };

export default transpiler;
