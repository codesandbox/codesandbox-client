/* eslint-disable import/default */
// @ts-ignore
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./worker/index';
/* eslint-enable import/default */
import { isBabel7 } from '@codesandbox/common/lib/utils/is-babel-7';

import regexGetRequireStatements from './worker/simple-get-require-statements';
import getBabelConfig from './babel-parser';
import WorkerTranspiler from '../worker-transpiler';
import { LoaderContext } from '../../transpiled-module';
import Manager from '../../manager';

import delay from '../../../utils/delay';
import { shouldTranspile } from './check';

const global = window as any;

// Right now this is in a worker, but when we're going to allow custom plugins
// we need to move this out of the worker again, because the config needs
// to support custom plugins
class BabelTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super('babel-loader', BabelWorker, 3, { hasFS: true, preload: true });
  }

  startupWorkersInitialized = false;

  async getWorker() {
    while (typeof global.babelworkers === 'undefined') {
      await delay(50); // eslint-disable-line
    }

    if (global.babelworkers.length === 0) {
      return super.getWorker();
    }

    // We set these up in startup.js.
    return global.babelworkers.pop();
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<{ transpiledCode: string }> {
    return new Promise((resolve, reject) => {
      const { path } = loaderContext;

      // When we find a node_module that already is commonjs we will just get the
      // dependencies from the file and return the same code. We get the dependencies
      // with a regex since commonjs modules just have `require` and regex is MUCH
      // faster than generating an AST from the code.
      if (
        (loaderContext.options.simpleRequire ||
          path.startsWith('/node_modules')) &&
        !shouldTranspile(code, path)
      ) {
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

      const dependencies =
        (configs.package &&
          configs.package.parsed &&
          configs.package.parsed.dependencies) ||
        {};

      const devDependencies =
        (configs.package &&
          configs.package.parsed &&
          configs.package.parsed.devDependencies) ||
        {};

      const isV7 =
        loaderContext.options.isV7 || isBabel7(dependencies, devDependencies);

      const hasMacros = Object.keys(dependencies).some(
        d => d.indexOf('macro') > -1
      );

      const babelConfig = getBabelConfig(
        foundConfig || (loaderOptions as any).config,
        loaderOptions,
        path,
        isV7
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
          hasMacros,
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

  async getTranspilerContext(manager: Manager): Promise<any> {
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
        // @ts-ignore
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
