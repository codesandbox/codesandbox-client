// @flow
import BabelWorker from 'worker-loader?name=babel-transpiler.[hash].worker.js!./babel-worker.js';

import getBabelConfig from './babel-parser';
import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';
import type { default as Manager } from '../../manager';

import delay from '../../../utils/delay';

// Right now this is in a worker, but when we're going to allow custom plugins
// we need to move this out of the worker again, because the config needs
// to support custom plugins
class BabelTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('babel-loader', BabelWorker, 2, { hasFS: true });
  }

  startupWorkersInitialized = false;

  async getWorker() {
    while (typeof window.babelworkers === 'undefined') {
      await delay(50); // eslint-disable-line
    }

    if (window.babelworkers.length === 0) {
      return super.getWorker();
    }

    // We set these up in startup.js.
    return window.babelworkers.pop();
  }

  doTranspilation(code: string, loaderContext: LoaderContext): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      let foundConfig = null;
      if (
        loaderContext.options.configurations &&
        loaderContext.options.configurations.babel &&
        loaderContext.options.configurations.babel.parsed
      ) {
        foundConfig = loaderContext.options.configurations.babel.parsed;
      }

      const babelConfig = getBabelConfig(
        foundConfig,
        loaderContext.options,
        path
      );

      this.queueTask(
        {
          code,
          config: babelConfig,
          path,
          loaderOptions: loaderContext.options || {},

          babelTranspilerOptions:
            loaderContext.options.configurations &&
            loaderContext.options.configurations.babelTranspiler &&
            loaderContext.options.configurations.babelTranspiler.parsed,
          sandboxOptions:
            loaderContext.options.configurations &&
            loaderContext.options.configurations.sandbox &&
            loaderContext.options.configurations.sandbox.parsed,
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

  async getTranspilerContext(manager: Manager) {
    return new Promise(async resolve => {
      const baseConfig = await super.getTranspilerContext(manager);

      this.queueTask(
        {
          type: 'get-babel-context',
        },
        'babelContext',
        {},
        (err, data) => {
          const { version, availablePlugins, availablePresets } = data;

          resolve({
            ...baseConfig,
            babelVersion: version,
            availablePlugins,
            availablePresets,
            babelTranspilerOptions:
              manager.configurations &&
              manager.configurations.babelTranspiler &&
              manager.configurations.babelTranspiler.parsed,
          });
        }
      );
    });
  }
}

const transpiler = new BabelTranspiler();

export { BabelTranspiler };

export default transpiler;
