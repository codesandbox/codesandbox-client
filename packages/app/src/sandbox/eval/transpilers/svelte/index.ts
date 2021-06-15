/* eslint-disable import/default */
// @ts-ignore
import SvelteWorker from 'worker-loader?publicPath=/&name=svelte-transpiler.[hash:8].worker.js!./svelte-worker';
/* eslint-enable import/default */

import semver from 'semver';
import { LoaderContext, TranspilerResult } from 'sandpack-core';
import { dispatch, actions } from 'codesandbox-api';

import WorkerTranspiler from '../worker-transpiler/transpiler';

class SvelteTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('svelte-loader', SvelteWorker, { maxWorkerCount: 2 });
  }

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    const packageJSON = loaderContext.options.configurations.package;
    const svelte =
      (packageJSON &&
        packageJSON.parsed &&
        packageJSON.parsed.devDependencies &&
        packageJSON.parsed.devDependencies.svelte &&
        semver.coerce(packageJSON.parsed.devDependencies.svelte)) ||
      semver.coerce(packageJSON.parsed.dependencies.svelte);

    const { path } = loaderContext;
    dispatch(actions.correction.clear(path, 'svelte'));
    const {
      transpiledCode,
      warnings,
    }: {
      transpiledCode: string;
      warnings: Array<any>;
    } = await this.queueCompileFn(
      {
        code,
        path,
        version: (svelte || {}).version,
      },
      loaderContext
    );
    if (warnings?.length) {
      warnings.forEach(loaderContext.emitWarning);
    }
    return { transpiledCode };
  }
}

const transpiler = new SvelteTranspiler();

export { SvelteTranspiler };

export default transpiler;
