// @flow
import { flattenDeep } from 'lodash';

import { actions, dispatch } from 'codesandbox-api';
import _debug from 'app/utils/debug';

import hashsum from 'hash-sum';

import * as pathUtils from 'common/utils/path';

import type { Module } from './entities/module';
import type { SourceMap } from './transpilers/utils/get-source-map';
import ModuleError from './errors/module-error';
import ModuleWarning from './errors/module-warning';

import type { WarningStructure } from './transpilers/utils/worker-warning-handler';

import resolveDependency from './loaders/dependency-resolver';
import evaluate from './loaders/eval';

import Manager from './manager';
import HMR from './hmr';

const debug = _debug('cs:compiler:transpiled-module');

type ChildModule = Module & {
  parent: Module,
};

class ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: ?SourceMap;

  constructor(fileName: string, compiledCode: string, sourceMap: ?SourceMap) {
    this.fileName = fileName;
    this.compiledCode = compiledCode;
    this.sourceMap = sourceMap;
  }
}

export type SerializedTranspiledModule = {
  module: Module,
  query: string,
  source: ?ModuleSource,
  assets: {
    [name: string]: ModuleSource,
  },
  isEntry: boolean,
  childModules: Array<string>,
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: Array<ModuleSource>,
  initiators: Array<string>,
  dependencies: Array<string>,
  asyncDependencies: Array<string>,
  transpilationDependencies: Array<string>,
  transpilationInitiators: Array<string>,
};

export type LoaderContext = {
  emitWarning: (warning: WarningStructure) => void,
  emitError: (error: Error) => void,
  emitModule: (
    title: string,
    code: string,
    currentPath?: string,
    overwrite?: boolean
  ) => TranspiledModule, // eslint-disable-line no-use-before-define
  emitFile: (name: string, content: string, sourceMap: SourceMap) => void,
  options: {
    context: '/',
    [key: string]: any,
  },
  webpack: boolean,
  sourceMap: boolean,
  target: string,
  path: string,
  getModules: () => Array<Module>,
  addDependency: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
    }
  ) => ?TranspiledModule, // eslint-disable-line no-use-before-define
  addDependenciesInDirectory: (
    depPath: string,
    options: {
      isAbsolute: boolean,
    }
  ) => Array<TranspiledModule>, // eslint-disable-line no-use-before-define
  _module: TranspiledModule, // eslint-disable-line no-use-before-define

  // Remaining loaders after current loader
  remainingRequest: string,
};

type Compilation = {
  exports: any,
};

export default class TranspiledModule {
  module: Module;
  query: string;
  source: ?ModuleSource;
  assets: {
    [name: string]: ModuleSource,
  };
  isEntry: boolean;
  childModules: Array<TranspiledModule>;
  errors: Array<ModuleError>;
  warnings: Array<ModuleWarning>;
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: Array<ModuleSource>;
  compilation: ?Compilation;
  initiators: Set<TranspiledModule>; // eslint-disable-line no-use-before-define
  dependencies: Set<TranspiledModule>; // eslint-disable-line no-use-before-define
  asyncDependencies: Array<Promise<TranspiledModule>>; // eslint-disable-line no-use-before-define
  transpilationDependencies: Set<TranspiledModule>;
  transpilationInitiators: Set<TranspiledModule>;

  // Unique identifier
  hash: string;

  /**
   * Set how this module handles HMR. The default is undefined, which means
   * that we handle the HMR like CodeSandbox does.
   */
  hmrConfig: ?HMR;

  /**
   * Create a new TranspiledModule, a transpiled module is a module that contains
   * all info for transpilation and compilation. Note that there can be multiple
   * transpiled modules for 1 module, since a same module can have different loaders
   * attached using queries.
   * @param {*} module
   * @param {*} query A webpack query, eg: "url-loader?mimetype=image/png"
   */
  constructor(module: Module, query: string = '') {
    this.module = module;
    this.query = query;
    this.errors = [];
    this.warnings = [];
    this.childModules = [];
    this.transpilationDependencies = new Set();
    this.dependencies = new Set();
    this.asyncDependencies = [];
    this.transpilationInitiators = new Set();
    this.initiators = new Set();
    this.isEntry = false;

    this.hash = hashsum(`${this.module.path}:${this.query}`);
  }

  getId() {
    return `${this.module.path}:${this.query}`;
  }

  dispose(manager: Manager) {
    if (this.hmrConfig) {
      // If this is a hot module we fully reload the application, same as Webpack v2.
      manager.markHardReload();
    }

    this.reset();

    // There are no other modules calling this module, so we run a function on
    // all transpilers that clears side effects if there are any. Example:
    // Remove CSS styles from the dom.
    manager.preset.getLoaders(this.module, this.query).forEach(t => {
      t.transpiler.cleanModule(this.getLoaderContext(manager, t.options));
    });
    manager.removeTranspiledModule(this);
  }

  reset() {
    // We don't reset the compilation if itself and its parents if HMR is
    // accepted for this module. We only mark it as changed so we can properly
    // handle the update in the evaluation.

    this.childModules.forEach(m => {
      m.reset();
    });
    this.childModules = [];
    this.emittedAssets = [];
    this.resetTranspilation();

    this.setIsEntry(false);
  }

  resetTranspilation() {
    Array.from(this.transpilationInitiators)
      .filter(t => t.source)
      .forEach(dep => {
        dep.resetTranspilation();
      });

    this.previousSource = this.source;
    this.source = null;

    this.errors = [];
    this.warnings = [];

    Array.from(this.dependencies).forEach(t => {
      t.initiators.delete(this);
    });
    // Don't do it for transpilation dependencies, since those cannot be traced back since we also reset transpilation of them.

    this.dependencies.clear();
    this.transpilationDependencies.clear();
    this.asyncDependencies = [];
  }

  resetCompilation() {
    if (this.hmrConfig && this.hmrConfig.isHot()) {
      this.hmrConfig.setDirty(true);
    } else {
      if (this.compilation) {
        try {
          this.compilation = null;
        } catch (e) {
          console.error(e);
        }
      }
      Array.from(this.initiators)
        .filter(t => t.compilation)
        .forEach(dep => {
          dep.resetCompilation();
        });

      Array.from(this.transpilationInitiators)
        .filter(t => t.compilation)
        .forEach(dep => {
          dep.resetCompilation();
        });
    }
  }

  update(module: Module): TranspiledModule {
    if (this.module.path !== module.path || this.module.code !== module.code) {
      this.module = module;
      this.resetTranspilation();
    }

    return this;
  }

  createSourceForAsset = (
    name: string,
    content: string,
    sourceMap: SourceMap
  ) => new ModuleSource(name, content, sourceMap);

  getLoaderContext(
    manager: Manager,
    transpilerOptions: ?Object = {}
  ): LoaderContext {
    return {
      emitWarning: warning => {
        this.warnings.push(new ModuleWarning(this, warning));
      },
      emitError: error => {
        this.errors.push(new ModuleError(this, error));
      },
      emitModule: (
        path: string,
        code: string,
        directoryPath: string = pathUtils.dirname(this.module.path),
        overwrite?: boolean = true
      ) => {
        const queryPath = path.split('!');
        // pop() mutates queryPath, queryPath is now just the loaders
        const modulePath = queryPath.pop();

        const moduleCopy: ChildModule = {
          path: pathUtils.join(directoryPath, modulePath),
          parent: this.module,
          code,
        };

        let transpiledModule;
        if (!overwrite) {
          try {
            transpiledModule = manager.resolveTranspiledModule(
              moduleCopy.path,
              queryPath.join('!')
            );

            transpiledModule.update(moduleCopy);
          } catch (e) {
            /* Nothing is here, just continue */
          }
        }

        transpiledModule =
          transpiledModule ||
          manager.addTranspiledModule(moduleCopy, queryPath.join('!'));
        // this.childModules.push(transpiledModule);

        this.dependencies.add(transpiledModule);
        transpiledModule.initiators.add(this);

        return transpiledModule;
      },
      emitFile: (name: string, content: string, sourceMap: SourceMap) => {
        this.assets[name] = this.createSourceForAsset(name, content, sourceMap);
      },
      // Add an explicit transpilation dependency, this is needed for loaders
      // that include the source of another file by themselves, we need to
      // force transpilation to rebuild the file
      addTranspilationDependency: (depPath: string, options) => {
        const tModule = manager.resolveTranspiledModule(
          depPath,
          options && options.isAbsolute ? '/' : this.module.path
        );

        this.transpilationDependencies.add(tModule);
        tModule.transpilationInitiators.add(this);

        return tModule;
      },
      addDependency: (depPath: string, options) => {
        if (
          depPath.startsWith('babel-runtime') ||
          depPath.startsWith('codesandbox-api')
        ) {
          return null;
        }

        try {
          const tModule = manager.resolveTranspiledModule(
            depPath,
            options && options.isAbsolute ? '/' : this.module.path
          );

          this.dependencies.add(tModule);
          tModule.initiators.add(this);

          return tModule;
        } catch (e) {
          if (e.type === 'module-not-found' && e.isDependency) {
            this.asyncDependencies.push(
              manager.downloadDependency(e.path, this.module.path)
            );
          } else {
            // Don't throw the error, we want to throw this error during evaluation
            // so we get the correct line as error
            if (process.env.NODE_ENV === 'development') {
              console.error(e);
            }
          }
        }
      },
      addDependenciesInDirectory: (folderPath: string, options) => {
        const tModules = manager.resolveTranspiledModulesInDirectory(
          folderPath,
          options && options.isAbsolute ? '/' : this.module.path
        );

        tModules.forEach(tModule => {
          this.dependencies.add(tModule);
          tModule.initiators.add(this);
        });

        return tModules;
      },
      getModules: (): Array<Module> => manager.getModules(),
      options: {
        context: pathUtils.dirname(this.module.path),
        ...transpilerOptions,
      },
      webpack: true,
      sourceMap: true,
      target: 'web',
      _module: this,
      path: this.module.path,
    };
  }

  /**
   * Mark the transpiled module as entry (or not), this is needed to let the
   * cleanup know that this module can have no initiators, but is still required.
   * @param {*} isEntry
   */
  setIsEntry(isEntry: boolean) {
    this.isEntry = isEntry;
  }

  /**
   * Transpile the module, it takes in all loaders from the default loaders +
   * query string and passes the result from loader to loader. During transpilation
   * dependencies can be added, these dependencies will be transpiled concurrently
   * after the initial transpilation finished.
   * @param {*} manager
   */
  async transpile(manager: Manager) {
    if (manager.transpileJobs[this.getId()]) {
      // Is already being transpiled
      return this;
    }

    manager.transpileJobs[this.getId()] = true;

    if (this.source) {
      return this;
    }

    // Remove this module from the initiators of old deps, so we can populate a
    // fresh cache
    this.dependencies.forEach(tModule => {
      tModule.initiators.delete(this);
    });
    this.transpilationDependencies.forEach(tModule => {
      tModule.transpilationInitiators.delete(this);
    });
    this.dependencies.clear();
    this.transpilationDependencies.clear();
    this.errors = [];
    this.warnings = [];

    let code = this.module.code || '';
    let finalSourceMap = null;

    if (this.module.requires) {
      // We now know that this has been transpiled on the server, so we shortcut
      const loaderContext = this.getLoaderContext(manager, {});
      // These are precomputed requires, for npm dependencies
      this.module.requires.forEach(loaderContext.addDependency);

      code = this.module.code;
    } else {
      const transpilers = manager.preset.getLoaders(this.module, this.query);

      const t = Date.now();
      for (let i = 0; i < transpilers.length; i += 1) {
        const transpilerConfig = transpilers[i];
        const loaderContext = this.getLoaderContext(
          manager,
          transpilerConfig.options || {}
        );
        loaderContext.remainingRequest = transpilers
          .slice(i + 1)
          .map(transpiler => transpiler.transpiler.name)
          .concat([this.module.path])
          .join('!');

        try {
          const {
            transpiledCode,
            sourceMap,
          } = await transpilerConfig.transpiler.transpile(code, loaderContext); // eslint-disable-line no-await-in-loop

          if (this.warnings.length) {
            this.warnings.forEach(warning => {
              console.warn(warning.message); // eslint-disable-line no-console
              dispatch(
                actions.correction.show(warning.message, {
                  line: warning.lineNumber,
                  column: warning.columnNumber,
                  path: warning.path,
                  source: warning.source,
                  severity: 'warning',
                })
              );
            });
          }

          if (this.errors.length) {
            throw this.errors[0];
          }

          code = transpiledCode;
          finalSourceMap = sourceMap;
        } catch (e) {
          e.fileName = loaderContext.path;
          e.tModule = this;
          this.resetTranspilation();
          manager.clearCache();
          throw e;
        }
        debug(`Transpiled '${this.getId()}' in ${Date.now() - t}ms`);
      }
    }

    // Add the source of the file by default, this is important for source mapping
    // errors back to their origin
    code = `${code}\n//# sourceURL=${location.origin}${this.module.path}${
      this.query ? `?${this.hash}` : ''
    }`;

    this.source = new ModuleSource(this.module.path, code, finalSourceMap);

    if (
      this.previousSource &&
      this.previousSource.compiledCode !== this.source.compiledCode
    ) {
      this.resetCompilation();
    }

    await Promise.all(
      this.asyncDependencies.map(async p => {
        try {
          const tModule = await p;

          this.dependencies.add(tModule);
          tModule.initiators.add(this);
        } catch (e) {
          /* let this handle at evaluation */
        }
      })
    );

    this.asyncDependencies = [];

    await Promise.all(
      flattenDeep([
        ...Array.from(this.transpilationInitiators).map(t =>
          t.transpile(manager)
        ),
        ...Array.from(this.dependencies).map(t => t.transpile(manager)),
      ])
    );

    return this;
  }

  evaluate(manager: Manager) {
    if (this.source == null) {
      // This scenario only happens when we are in an inconsistent state, the quickest way to solve
      // this state is to just hard reload everything.
      manager.clearCache();
      document.location.reload();
      throw new Error(`${this.module.path} hasn't been transpiled yet.`);
    }

    const localModule = this.module;

    if (manager.webpackHMR) {
      if (!this.compilation) {
        const shouldReloadPage = this.hmrConfig
          ? this.hmrConfig.isDeclined(this.isEntry)
          : this.isEntry;

        if (shouldReloadPage) {
          location.reload();
          return {};
        }
      } else if (!this.hmrConfig || !this.hmrConfig.isDirty()) {
        return this.compilation.exports;
      }
    }

    if (this.hmrConfig) {
      // Call module.hot.dispose handler
      // https://webpack.js.org/api/hot-module-replacement/#dispose-or-adddisposehandler-
      this.hmrConfig.callDisposeHandler();
    }

    const hotData = this.hmrConfig ? this.hmrConfig.data : undefined;

    this.compilation = this.compilation || {
      id: this.getId(),
      exports: {},
      hot: {
        accept: (path: string | Array<string>, cb) => {
          if (typeof path === 'undefined') {
            // Self mark hot
            this.hmrConfig = this.hmrConfig || new HMR();
            this.hmrConfig.setType('accept');
            this.hmrConfig.setSelfAccepted(true);
          } else {
            const paths = typeof path === 'string' ? [path] : path;

            paths.forEach(p => {
              const tModule = manager.resolveTranspiledModule(
                p,
                this.module.path
              );

              tModule.hmrConfig = tModule.hmrConfig || new HMR();
              tModule.hmrConfig.setType('accept');
              tModule.hmrConfig.setAcceptCallback(cb);
            });
          }
          manager.enableWebpackHMR();
        },
        decline: (path: string | Array<string>) => {
          if (typeof path === 'undefined') {
            this.hmrConfig = this.hmrConfig || new HMR();
            this.hmrConfig.setType('decline');
          } else {
            const paths = typeof path === 'string' ? [path] : path;

            paths.forEach(p => {
              const tModule = manager.resolveTranspiledModule(
                p,
                this.module.path
              );
              tModule.hmrConfig = tModule.hmrConfig || new HMR();
              tModule.hmrConfig.setType('decline');
            });
          }
          manager.enableWebpackHMR();
        },
        dispose: (cb: Function) => {
          this.hmrConfig = this.hmrConfig || new HMR();

          this.hmrConfig.setDisposeHandler(cb);
        },
        data: hotData,
      },
    };
    this.compilation.hot.data = hotData;

    // Reset export object while keeping references
    // Object.keys(this.compilation.exports).forEach(key => {
    //   delete this.compilation.exports[key];
    // });
    const transpiledModule = this;

    try {
      // eslint-disable-next-line no-inner-declarations
      function require(path: string) {
        // First check if there is an alias for the path, in that case
        // we must alter the path to it
        const aliasedPath = manager.preset.getAliasedPath(path);

        // eslint-disable-line no-unused-vars
        if (/^(\w|@\w)/.test(aliasedPath) && !aliasedPath.includes('!')) {
          // So it must be a dependency
          if (
            aliasedPath.startsWith('babel-runtime') ||
            aliasedPath.startsWith('codesandbox-api')
          )
            return resolveDependency(aliasedPath, manager.externals);
        }

        const requiredTranspiledModule = manager.resolveTranspiledModule(
          aliasedPath,
          localModule.path
        );

        if (transpiledModule === requiredTranspiledModule) {
          throw new Error(`${localModule.path} is importing itself`);
        }

        // Check if this module has been evaluated before, if so return the exports
        // of that compilation
        const cache = requiredTranspiledModule.compilation;

        return cache
          ? cache.exports
          : manager.evaluateTranspiledModule(requiredTranspiledModule);
      }

      const exports = evaluate(
        this.source.compiledCode,
        require,
        this.compilation,
        manager.envVariables
      );

      const hmrConfig = this.hmrConfig;
      if (hmrConfig && hmrConfig.isHot()) {
        hmrConfig.setDirty(false);
        hmrConfig.callAcceptCallback();
      }

      return exports;
    } catch (e) {
      e.tModule = e.tModule || transpiledModule;

      throw e;
    }
  }

  postTranspile(manager: Manager) {
    if (
      this.initiators.size === 0 &&
      this.transpilationInitiators.size === 0 &&
      !this.isEntry
    ) {
      // Remove the module from the transpiler if it's not used anymore
      debug(`Removing '${this.getId()}' from manager.`);
      this.dispose(manager);
    }
  }

  postEvaluate(manager: Manager) {
    if (!manager.webpackHMR) {
      // For non cacheable transpilers we remove the cached evaluation
      if (
        manager.preset
          .getLoaders(this.module, this.query)
          .some(t => !t.transpiler.cacheable)
      ) {
        this.compilation = null;
      }
    }
  }

  serialize(): SerializedTranspiledModule {
    const serializableObject = {};

    serializableObject.query = this.query;
    serializableObject.assets = this.assets;
    serializableObject.module = this.module;
    serializableObject.emittedAssets = this.emittedAssets;
    serializableObject.isEntry = this.isEntry;
    serializableObject.source = this.source;
    serializableObject.childModules = this.childModules.map(m => m.getId());
    serializableObject.dependencies = Array.from(this.dependencies).map(m =>
      m.getId()
    );
    serializableObject.initiators = Array.from(this.initiators).map(m =>
      m.getId()
    );
    serializableObject.transpilationDependencies = Array.from(
      this.transpilationDependencies
    ).map(m => m.getId());
    serializableObject.transpilationInitiators = Array.from(
      this.transpilationInitiators
    ).map(m => m.getId());

    serializableObject.asyncDependencies = [];
    // At this stage we know that all modules are already resolved and the promises
    // are downloaded. So we can just handle this synchronously.
    Array.from(this.asyncDependencies).forEach(m => {
      m.then(x => {
        serializableObject.asyncDependencies.push(x.getId());
      });
    });

    return (serializableObject: SerializedTranspiledModule);
  }

  async load(
    data: SerializedTranspiledModule,
    state: { [id: string]: TranspiledModule }
  ) {
    this.query = data.query;
    this.assets = data.assets;
    this.module = data.module;
    this.emittedAssets = data.emittedAssets;
    this.isEntry = data.isEntry;
    this.source = data.source;

    data.dependencies.forEach((depId: string) => {
      this.dependencies.add(state[depId]);
    });
    data.childModules.forEach((depId: string) => {
      this.childModules.push(state[depId]);
    });
    data.initiators.forEach((depId: string) => {
      this.initiators.add(state[depId]);
    });
    data.transpilationDependencies.forEach((depId: string) => {
      this.transpilationDependencies.add(state[depId]);
    });
    data.transpilationInitiators.forEach((depId: string) => {
      this.transpilationInitiators.add(state[depId]);
    });

    data.asyncDependencies.forEach((depId: string) => {
      this.asyncDependencies.push(Promise.resolve(state[depId]));
    });
  }
}
