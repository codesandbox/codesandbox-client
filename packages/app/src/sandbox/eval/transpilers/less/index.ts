/* eslint-disable import/default */
// @ts-ignore
import LessWorker from 'worker-loader?publicPath=/&name=less-transpiler.[hash:8].worker.js!./less-worker';
/* eslint-enable import/default */

import { LoaderContext, TranspilerResult } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler/transpiler';

class LessTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('less-loader', LessWorker, {
      maxWorkerCount: 1,
    });

    this.cacheable = false;
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const modules = loaderContext.getModules();
    const lessModules = modules.filter(m => /.*\.(css|less)$/.test(m.path));
    const files = lessModules.reduce(
      (interMediateFiles, module) => ({
        ...interMediateFiles,
        [module.path]: module.code,
      }),
      {}
    );

    const { path } = loaderContext;
    files[path] = code;

    const {
      css: transpiledCode,
      transpilationDependencies,
    } = await this.queueCompileFn(
      {
        code,
        files,
        path,
      },
      loaderContext
    );

    await Promise.all(
      transpilationDependencies.map(dep =>
        loaderContext.addTranspilationDependency(dep.path, dep.options || {})
      )
    );

    return { transpiledCode };
  }
}

const transpiler = new LessTranspiler();

export { LessTranspiler };

export default transpiler;
