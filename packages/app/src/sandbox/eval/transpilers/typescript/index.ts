/* eslint-disable import/default */
// @ts-ignore
import TypeScriptWorker from 'worker-loader?publicPath=/&name=typescript-transpiler.[hash:8].worker.js!./typescript-worker';
/* eslint-enable import/default */
import { getDependenciesFromConfig } from 'sandbox/eval/utils/get-dependencies';
import { LoaderContext, TranspilerResult } from 'sandpack-core';

import WorkerTranspiler from '../worker-transpiler/transpiler';

class TypeScriptTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('ts-loader', TypeScriptWorker, { maxWorkerCount: 3 });
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const { path } = loaderContext;

    let foundConfig = null;
    let typescriptVersion = '3.4.1';
    if (
      loaderContext.options.configurations &&
      loaderContext.options.configurations.typescript &&
      loaderContext.options.configurations.typescript.parsed
    ) {
      foundConfig = loaderContext.options.configurations.typescript.parsed;
    }

    const dependencies = getDependenciesFromConfig(
      loaderContext.options.configurations
    );
    if (dependencies && dependencies.typescript) {
      typescriptVersion = dependencies.typescript;
    }

    const { transpiledCode, foundDependencies } = await this.queueCompileFn(
      {
        code,
        path,
        config: foundConfig,
        typescriptVersion,
      },
      loaderContext
    );

    await Promise.all(
      foundDependencies.map(async dep => {
        if (dep.isGlob) {
          loaderContext.addDependenciesInDirectory(dep.path, {
            isAbsolute: dep.isAbsolute,
            isEntry: dep.isEntry,
          });
        } else {
          await loaderContext.addDependency(dep.path, {
            isAbsolute: dep.isAbsolute,
            isEntry: dep.isEntry,
          });
        }
      })
    );

    return { transpiledCode };
  }
}

const transpiler = new TypeScriptTranspiler();

export { TypeScriptTranspiler };

export default transpiler;
