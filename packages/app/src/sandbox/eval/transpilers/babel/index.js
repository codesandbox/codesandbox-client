// @flow
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash].worker.js!./worker/index.js';

import isESModule from '../../utils/is-es-module';
import regexGetRequireStatements from './worker/simple-get-require-statements';
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

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<{ transpiledCode: string }> {
    return new Promise((resolve, reject) => {
      const path = loaderContext.path;

      // When we find a node_module that already is commonjs we will just get the
      // dependencies from the file and return the same code. We get the dependencies
      // with a regex since commonjs modules just have `require` and regex is MUCH
      // faster than generating an AST from the code.
      if (path.startsWith('/node_modules') && !isESModule(code)) {
        regexGetRequireStatements(code).forEach(dependency => {
          if (dependency.isGlob) {
            loaderContext.addDependenciesInDirectory(dependency.path);
          } else {
            loaderContext.addDependency(dependency.path);
          }
        });

        resolve({
          transpiledCode: code,
        });
        return;
      }

      const configs = loaderContext.options.configurations;

      const foundConfig = configs.babel && configs.babel.parsed;

      const loaderOptions = loaderContext.options || {};

      const babelConfig = getBabelConfig(foundConfig, loaderOptions, path);

      const isV7 = !!(
        configs.package &&
        configs.package.parsed &&
        configs.package.parsed.devDependencies &&
        configs.package.parsed.devDependencies['@vue/cli-plugin-babel']
      );

      this.queueTask(
        {
          code,
          config: babelConfig,
          path,
          loaderOptions,
          babelTranspilerOptions:
            configs &&
            configs.babelTranspiler &&
            configs.babelTranspiler.parsed,
          sandboxOptions: configs && configs.sandbox && configs.sandbox.parsed,
          version: isV7 ? 7 : 6,
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

      const babelTranspilerOptions =
        manager.configurations &&
        manager.configurations.babelTranspiler &&
        manager.configurations.babelTranspiler.parsed;

      this.queueTask(
        {
          type: 'get-babel-context',
          babelTranspilerOptions,
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
            babelTranspilerOptions,
          });
        }
      );
    });
  }
}

const transpiler = new BabelTranspiler();

export { BabelTranspiler };

export default transpiler;
