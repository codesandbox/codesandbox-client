/* eslint-enable import/default */
import { isBabel7 } from '@codesandbox/common/es/utils/is-babel-7';
import isESModule from 'sandbox/eval/utils/is-es-module';
/* eslint-disable import/default */
// @ts-ignore
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./worker/index';

import delay from '../../../utils/delay';
import { endMeasure, measure } from '../../../utils/metrics';
import Manager from '../../manager';
import { LoaderContext } from '../../transpiled-module';
import WorkerTranspiler from '../worker-transpiler';
import getBabelConfig from './babel-parser';
import { hasNewSyntax } from './check';
import { convertEsModule } from './convert-esmodule';
import regexGetRequireStatements from './worker/simple-get-require-statements';

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
      let newCode = code;

      const isNodeModule = path.startsWith('/node_modules');

      let convertedToEsmodule = false;
      if (isESModule(newCode) && isNodeModule) {
        try {
          measure(`esconvert-${path}`);
          newCode = convertEsModule(newCode);
          endMeasure(`esconvert-${path}`, { silent: true });
          convertedToEsmodule = true;
        } catch (e) {
          console.warn(
            `Error when converting '${path}' esmodule to commonjs: ${e.message}`
          );
        }
      }

      try {
        // When we find a node_module that already is commonjs we will just get the
        // dependencies from the file and return the same code. We get the dependencies
        // with a regex since commonjs modules just have `require` and regex is MUCH
        // faster than generating an AST from the code.
        if (
          (loaderContext.options.simpleRequire || isNodeModule) &&
          !hasNewSyntax(newCode, path) &&
          !(isESModule(newCode) && !convertedToEsmodule)
        ) {
          regexGetRequireStatements(newCode).forEach(dependency => {
            if (dependency.isGlob) {
              loaderContext.addDependenciesInDirectory(dependency.path);
            } else {
              loaderContext.addDependency(dependency.path);
            }
          });

          resolve({
            transpiledCode: newCode,
          });
          return;
        }
      } catch (e) {
        console.warn(
          `Error when reading dependencies of '${path}' using quick method: '${e.message}'`
        );
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
        d => d.indexOf('macro') > -1 || d.indexOf('codegen') > -1
      );

      const babelConfig = getBabelConfig(
        foundConfig || (loaderOptions as any).config,
        loaderOptions,
        path,
        isV7
      );

      this.queueTask(
        {
          code: newCode,
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
          const { version, availablePlugins, availablePresets } = data as any;

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
