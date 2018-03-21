// @flow
import getBabelConfig from './babel-parser';
import WorkerTranspiler from '../worker-transpiler';
import { type LoaderContext } from '../../transpiled-module';

import delay from '../../../utils/delay';

// Right now this is in a worker, but when we're going to allow custom plugins
// we need to move this out of the worker again, because the config needs
// to support custom plugins
class BabelTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('babel-loader', null, 2, { hasFS: true });
  }

  async getWorker() {
    while (typeof window.babelworkers === 'undefined') {
      await delay(50); // eslint-disable-line
    }
    // We set these up in startup.js.
    const worker = window.babelworkers.pop();
    return worker;
  }

  doTranspilation(code: string, loaderContext: LoaderContext): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;
      const configs = loaderContext.options.configurations;

      let foundConfig = loaderContext.options;
      if (configs && configs.babel && configs.babel.parsed) {
        foundConfig = configs.babel.parsed;
      }

      const babelConfig = getBabelConfig(
        foundConfig,
        loaderContext.options,
        path
      );

      const isV7 = !!(
        configs.package.parsed.devDependencies &&
        configs.package.parsed.devDependencies['@vue/cli-plugin-babel']
      );

      this.queueTask(
        {
          code,
          config: babelConfig,
          path,
          loaderOptions: loaderContext.options,
          sandboxOptions: configs && configs.sandbox && configs.sandbox.parsed,
          version: isV7 ? 7 : 6,
        },
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

const transpiler = new BabelTranspiler();

export { BabelTranspiler };

export default transpiler;
