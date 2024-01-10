// @ts-ignore
import StencilWorker from 'worker-loader?publicPath=/&name=stencil-transpiler.[hash:8].worker.js!./stencil-worker.ts';
import { LoaderContext } from 'sandpack-core';

import WorkerTranspiler from '../worker-transpiler/transpiler';

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
    super('stencil-loader', StencilWorker, { maxWorkerCount: 2 });
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const path = loaderContext.path;
    const packageJSON = loaderContext.options.configurations.package;

    const stencilVersion = getStencilVersion(packageJSON);

    const { transpiledCode, dependencies } = await this.queueCompileFn(
      {
        code,
        path,
        stencilVersion,
      },
      loaderContext
    );

    await Promise.all(
      dependencies.map(dep => loaderContext.addDependency(dep.path))
    );

    return { transpiledCode };
  }
}

const transpiler = new StencilTranspiler();

export { StencilTranspiler };

export default transpiler;
