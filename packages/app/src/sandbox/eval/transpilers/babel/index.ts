/* eslint-enable import/default */
import { isBabel7 } from '@codesandbox/common/lib/utils/is-babel-7';
import { isUrl } from '@codesandbox/common/lib/utils/is-url';

/* eslint-disable import/default */
// @ts-ignore
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./worker/index';

import delay from '@codesandbox/common/lib/utils/delay';
import { endMeasure, measure } from '@codesandbox/common/lib/utils/metrics';
import { LoaderContext, Manager } from 'sandpack-core';
import WorkerTranspiler from '../worker-transpiler/transpiler';
import getBabelConfig from './babel-parser';
import { getSyntaxInfoFromAst } from './ast/syntax-info';
import { convertEsModule } from './ast/convert-esmodule';
import { ESTreeAST, generateCode, parseModule } from './ast/utils';
import { collectDependenciesFromAST } from './ast/collect-dependencies';
import { rewriteImportMeta } from './ast/rewrite-meta';

const MAX_WORKER_ITERS = 100;

interface TranspilationResult {
  transpiledCode: string;
}

const WORKER_COUNT = process.env.SANDPACK ? 1 : 3;

interface IDep {
  path: string;
  isAbsolute?: boolean;
  isEntry?: boolean;
  isGlob?: boolean;
}

function addCollectedDependencies(
  loaderContext: LoaderContext,
  deps: Array<IDep>
): Promise<Array<void>> {
  return Promise.all(
    deps.map(async dep => {
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
}

// Right now this is in a worker, but when we're going to allow custom plugins
// we need to move this out of the worker again, because the config needs
// to support custom plugins
class BabelTranspiler extends WorkerTranspiler {
  worker: Worker;

  constructor() {
    super(
      'babel-loader',
      // @ts-ignore
      async () => {
        let iteration = 0;
        while (typeof globalThis.babelworkers === 'undefined') {
          if (iteration >= MAX_WORKER_ITERS) {
            throw new Error('Could not load Babel worker');
          }
          await delay(50); // eslint-disable-line
          iteration++;
        }

        if (globalThis.babelworkers.length === 0) {
          return BabelWorker();
        }

        // We set these up in startup.ts.
        return globalThis.babelworkers.pop();
      },
      {
        maxWorkerCount: WORKER_COUNT,
        preload: true,
      }
    );
  }

  startupWorkersInitialized = false;

  async doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilationResult> {
    const { path } = loaderContext;
    const isNodeModule = path.startsWith('/node_modules') || isUrl(path);

    /**
     * We should never transpile babel-standalone, because it relies on code that runs
     * in non-strict mode. Transpiling this code would add a "use strict;" piece, which
     * would then break the code (because it expects `this` to be global). No transpiler
     * can fix this, and because of this we need to just specifically ignore this file.
     */
    if (path === '/node_modules/babel-standalone/babel.js') {
      return { transpiledCode: code };
    }

    // Check if we can take a shortcut, we have a custom pipeline for transforming
    // node_modules to commonjs and collecting deps
    if (loaderContext.options.simpleRequire || isNodeModule) {
      try {
        const ast: ESTreeAST = parseModule(code);
        const syntaxInfo = getSyntaxInfoFromAst(ast);
        if (!syntaxInfo.jsx) {
          // If the code is ESM we transform it to commonjs and return it
          if (syntaxInfo.esm || syntaxInfo.dynamicImports) {
            measure(`esconvert-${path}`);
            if (syntaxInfo.esm) {
              convertEsModule(ast);
            }
            // We collect requires instead of doing this in convertESModule as some modules also use require
            // Which is actually invalid but we probably don't wanna break anyone's code if it works in other bundlers...
            const deps = collectDependenciesFromAST(ast);
            await addCollectedDependencies(
              loaderContext,
              deps.map(d => ({
                path: d,
              }))
            );
            rewriteImportMeta(ast, {
              url: loaderContext.url,
            });
            endMeasure(`esconvert-${path}`, { silent: true });
            return {
              transpiledCode: generateCode(ast),
            };
          }

          // If the code is commonjs and does not contain any more jsx, we generate and return the code.
          measure(`dep-collection-${path}`);
          const deps = collectDependenciesFromAST(ast);
          await addCollectedDependencies(
            loaderContext,
            deps.map(d => ({
              path: d,
            }))
          );
          endMeasure(`dep-collection-${path}`, { silent: true });
          return {
            transpiledCode: code,
          };
        }
      } catch (err) {
        // do not log this in production, it confuses our users
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Error occurred while trying to quickly transform '${path}'`
          );
          console.warn(err);
        }
      }
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

    const {
      code: transpiledCode,
      dependencies: foundDependencies,
    } = await this.queueCompileFn(
      {
        code,
        config: babelConfig,
        path,
        loaderOptions,
        babelTranspilerOptions:
          configs && configs.babelTranspiler && configs.babelTranspiler.parsed,
        sandboxOptions: configs && configs.sandbox && configs.sandbox.parsed,
        version: isV7 ? 7 : 6,
        hasMacros,
      },
      loaderContext
    );

    await addCollectedDependencies(loaderContext, foundDependencies);

    return { transpiledCode };
  }

  async getTranspilerContext(manager: Manager): Promise<any> {
    const baseConfig = await super.getTranspilerContext(manager);

    const babelTranspilerOptions =
      manager.configurations &&
      manager.configurations.babelTranspiler &&
      manager.configurations.babelTranspiler.parsed;

    const result = await this.workerManager.callFn({
      method: 'get-babel-context',
      data: {
        transpilerOptions: babelTranspilerOptions,
      },
    });

    const { version, availablePlugins, availablePresets } = result;
    return {
      ...baseConfig,
      babelVersion: version,
      availablePlugins,
      availablePresets,
      babelTranspilerOptions,
    };
  }
}

const transpiler = new BabelTranspiler();

export { BabelTranspiler };

export default transpiler;
