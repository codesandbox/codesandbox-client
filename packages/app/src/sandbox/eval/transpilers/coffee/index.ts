/* eslint-disable import/default */
// @ts-ignore
import CoffeeWorker from 'worker-loader?publicPath=/&name=coffee-transpiler.[hash:8].worker.js!./coffee-worker';
/* eslint-enable import/default */

import { LoaderContext, TranspilerResult } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler/transpiler';

class CoffeeTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('coffee-loader', CoffeeWorker, {
      maxWorkerCount: 1,
    });

    this.cacheable = false;
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const { code: transpiledCode } = await this.queueCompileFn(
      {
        code,
        path: loaderContext.path,
      },
      loaderContext
    );
    return { transpiledCode };
  }
}

const transpiler = new CoffeeTranspiler();

export { CoffeeTranspiler };

export default transpiler;
