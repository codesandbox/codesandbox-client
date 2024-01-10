// @ts-ignore
import SassWorker from 'worker-loader?publicPath=/&name=sass-transpiler.[hash:8].worker.js!./worker';

import { LoaderContext, TranspilerResult } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler/transpiler';

class SassTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('sass-loader', SassWorker, { maxWorkerCount: 1, hasFS: true });

    this.cacheable = false;
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    if (!code) {
      return { transpiledCode: '' };
    }

    const indentedSyntax =
      loaderContext.options.indentedSyntax == null
        ? loaderContext.path.endsWith('.sass')
        : true;

    const {
      transpiledCode,
      transpilationDependencies,
    } = await this.queueCompileFn(
      {
        code,
        path: loaderContext.path,
        indentedSyntax,
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

const transpiler = new SassTranspiler();

export { SassTranspiler };

export default transpiler;
