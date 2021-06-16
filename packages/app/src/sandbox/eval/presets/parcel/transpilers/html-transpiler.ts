import { LoaderContext, TranspilerResult } from 'sandpack-core';

// @ts-ignore
import HTMLWorker from 'worker-loader?publicPath=/&name=parcel-html-transpiler.[hash:8].worker.js!./html-worker';
import WorkerTranspiler from '../../../transpilers/worker-transpiler/transpiler';

class HTMLTranspiler extends WorkerTranspiler {
  constructor() {
    super('html-loader', HTMLWorker, { maxWorkerCount: 1 });

    this.HMREnabled = false;
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const { transpiledCode, foundDependencies } = await this.queueCompileFn(
      {
        code,
      },
      loaderContext
    );

    await Promise.all(
      foundDependencies.map(dep =>
        loaderContext.addDependency(dep.path, {
          isAbsolute: dep.isAbsolute,
          isEntry: dep.isEntry,
        })
      )
    );

    return { transpiledCode };
  }
}

const transpiler = new HTMLTranspiler();

export { HTMLTranspiler };

export default transpiler;
