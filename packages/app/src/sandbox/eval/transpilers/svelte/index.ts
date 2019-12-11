/* eslint-disable import/default */
// @ts-ignore
import SvelteWorker from 'worker-loader?publicPath=/&name=svelte-transpiler.[hash:8].worker.js!./svelte-worker';
/* eslint-enable import/default */

import semver from 'semver';

import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import { TranspilerResult } from '..';

class SvelteTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('svelte-loader', SvelteWorker, 2);
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const packageJSON = loaderContext.options.configurations.package;
    const svelte =
      (packageJSON &&
        packageJSON.parsed &&
        packageJSON.parsed.devDependencies &&
        packageJSON.parsed.devDependencies.svelte &&
        semver.coerce(packageJSON.parsed.devDependencies.svelte)) ||
      semver.coerce(packageJSON.parsed.dependencies.svelte);

    return new Promise<TranspilerResult>((resolve, reject) => {
      const { path } = loaderContext;

      this.queueTask(
        {
          code,
          path,
          version: (svelte || {}).version,
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

const transpiler = new SvelteTranspiler();

export { SvelteTranspiler };

export default transpiler;
