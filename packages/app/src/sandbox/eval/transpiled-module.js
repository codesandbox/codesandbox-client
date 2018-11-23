// @flow
import { flattenDeep } from 'lodash-es';

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
import isESModule from './utils/is-es-module';

import type { default as Manager } from './manager';
import HMR from './hmr';

const debug = _debug('cs:compiler:transpiled-module');

type ChildModule = Module & {
  parent: Module,
};

class ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: ?SourceMap;
  sourceEqualsCompiled: boolean;

  constructor(
    fileName: string,
    compiledCode: string,
    sourceMap: ?SourceMap,
    sourceEqualsCompiled = false
  ) {
    this.fileName = fileName;
    this.compiledCode = compiledCode;
    this.sourceMap = sourceMap;
    this.sourceEqualsCompiled = sourceEqualsCompiled;
  }
}

export type SerializedTranspiledModule = {
  module: Module,
  query: string,
  source: ?ModuleSource,
  sourceEqualsCompiled: boolean,
  assets: {
    [name: string]: ModuleSource,
  },
  isEntry: boolean,
  isTestFile: boolean,
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

/* eslint-disable no-use-before-define */
export type LoaderContext = {
  emitWarning: (warning: WarningStructure) => void,
  emitError: (error: Error) => void,
  emitModule: (
    title: string,
    code: string,
    currentPath?: string,
    overwrite?: boolean
  ) => TranspiledModule,
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
  addTranspilationDependency: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
    }
  ) => void,
  resolveTranspiledModule: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
      ignoredExtensions?: Array<string>,
    }
  ) => TranspiledModule,
  resolveTranspiledModuleAsync: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
      ignoredExtensions?: Array<string>,
    }
  ) => Promise<TranspiledModule>,
  addDependency: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
      isEntry: boolean,
    }
  ) => void,
  addDependenciesInDirectory: (
    depPath: string,
    options: ?{
      isAbsolute: boolean,
      isEntry: boolean,
    }
  ) => void,
  _module: TranspiledModule,

  // Remaining loaders after current loader
  remainingRequests: string,
  template: string,
};
/* eslint-enable */

type Compilation = {
  exports: any,
  hot: {
    accept: Function,
    accept: (string | Array<string>, cb: Function) => void,
    decline: (path: string | Array<string>) => void,
    dispose: (cb: Function) => void,
    data: Object,
    status: string,
  },
};

export default class TranspiledModule {
  module: Module;
  query: string;
  previousSource: ?ModuleSource;
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

  isTestFile: boolean = false;

  /**
   * Set how this module handles HMR. The default is undefined, which means
   * that we handle the HMR like CodeSandbox does.
   */
  hmrConfig: ?HMR;

  hasMissingDependencies: boolean = false;

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
    this.isTestFile = false;

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

    // Reset parents
    this.initiators.forEach(tModule => {
      tModule.resetTranspilation();
    });

    // There are no other modules calling this module, so we run a function on
    // all transpilers that clears side effects if there are any. Example:
    // Remove CSS styles from the dom.
    manager.preset.getLoaders(this.module, this.query).forEach(t => {
      if (t.transpiler.cleanModule) {
        t.transpiler.cleanModule(this.getLoaderContext(manager, t.options));
      }
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
    this.setIsTestFile(false);
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
        this.compilation = null;
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

      // If this is an entry we want all direct entries to be reset as well.
      // Entries generally have side effects
      if (this.isEntry) {
        Array.from(this.dependencies)
          .filter(t => t.compilation && t.isEntry)
          .forEach(dep => {
            dep.resetCompilation();
          });
      }
    }
  }

  /**
   * Determines if this is a module that should be transpiled if updated. If this
   * is a transpilationDependency that's updated then it should not get transpiled, but the parent should.
   */
  shouldTranspile() {
    return (
      !this.source &&
      !this.isTestFile &&
      !(this.initiators.size === 0 && this.transpilationInitiators.size > 0)
    );
  }

  addDependency(
    manager: Manager,
    depPath: string,
    options: ?{
      isAbsolute: boolean,
      isEntry: boolean,
    },
    isTranspilationDep: boolean = false
  ) {
    if (depPath.startsWith('codesandbox-api')) {
      return;
    }

    try {
      const tModule = manager.resolveTranspiledModule(
        depPath,
        options && options.isAbsolute ? '/' : this.module.path
      );

      if (isTranspilationDep) {
        this.transpilationDependencies.add(tModule);
        tModule.transpilationInitiators.add(this);
      } else {
        this.dependencies.add(tModule);
        tModule.initiators.add(this);
      }

      if (options.isEntry) {
        tModule.setIsEntry(true);
      }
    } catch (e) {
      if (e.type === 'module-not-found' && e.isDependency) {
        this.asyncDependencies.push(manager.downloadDependency(e.path, this));
      } else {
        // When a custom file resolver is given to the manager we will try
        // to resolve using this file resolver. If that fails we will still
        // mark the dependency as having missing deps.
        if (manager.fileResolver) {
          this.asyncDependencies.push(
            new Promise(async resolve => {
              try {
                const tModule = await manager.resolveTranspiledModule(
                  depPath,
                  options && options.isAbsolute ? '/' : this.module.path,
                  undefined,
                  true
                );

                if (isTranspilationDep) {
                  this.transpilationDependencies.add(tModule);
                  tModule.transpilationInitiators.add(this);
                } else {
                  this.dependencies.add(tModule);
                  tModule.initiators.add(this);
                }

                if (options.isEntry) {
                  tModule.setIsEntry(true);
                }
                resolve(tModule);
              } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                  console.error(
                    'Problem while trying to fetch file from custom fileResolver'
                  );
                  console.error(err);
                }

                this.hasMissingDependencies = true;
              }
            })
          );
          return;
        }

        // Don't throw the error, we want to throw this error during evaluation
        // so we get the correct line as error
        // ... Thank you so much for this younger Ives, you saved me here.
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }

        this.hasMissingDependencies = true;
      }
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

        // $FlowIssue
        let transpiledModule: TranspiledModule;
        if (!overwrite) {
          try {
            transpiledModule = manager.getTranspiledModule(
              moduleCopy,
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

        this.childModules.push(transpiledModule);
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
        this.addDependency(manager, depPath, options, true);
      },
      addDependency: async (depPath: string, options = {}) => {
        this.addDependency(manager, depPath, options);
      },
      addDependenciesInDirectory: (folderPath: string, options = {}) => {
        const tModules = manager.resolveTranspiledModulesInDirectory(
          folderPath,
          options && options.isAbsolute ? '/' : this.module.path
        );

        tModules.forEach(tModule => {
          this.dependencies.add(tModule);
          tModule.initiators.add(this);

          if (options.isEntry) {
            tModule.setIsEntry(true);
          }
        });
      },
      resolveTranspiledModule: (depPath: string, options = {}) =>
        manager.resolveTranspiledModule(
          depPath,
          options.isAbsolute ? '/' : this.module.path,
          options.ignoredExtensions
        ),
      resolveTranspiledModuleAsync: (depPath: string, options = {}) =>
        manager.resolveTranspiledModuleAsync(
          depPath,
          options.isAbsolute ? null : this,
          options.ignoredExtensions
        ),
      getModules: (): Array<Module> => manager.getModules(),
      options: {
        context: pathUtils.dirname(this.module.path),
        configurations: manager.configurations,
        ...transpilerOptions,
      },
      webpack: true,
      sourceMap: true,
      target: 'web',
      _module: this,
      path: this.module.path,
      template: manager.preset.name,
      remainingRequests: '', // will be filled during transpilation
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
   * Mark if this is a test file. If this is a test file we know that we don't
   * need to do any refresh or fixing when an error is thrown by the module. It's
   * not a vital module after all.
   */
  setIsTestFile(isTestFile: boolean) {
    this.isTestFile = isTestFile;
  }

  /**
   * Transpile the module, it takes in all loaders from the default loaders +
   * query string and passes the result from loader to loader. During transpilation
   * dependencies can be added, these dependencies will be transpiled concurrently
   * after the initial transpilation finished.
   * @param {*} manager
   */
  async transpile(manager: Manager) {
    if (this.source) {
      return this;
    }

    if (manager.transpileJobs[this.getId()]) {
      // Is already being transpiled
      return this;
    }

    // eslint-disable-next-line
    manager.transpileJobs[this.getId()] = true;

    this.hasMissingDependencies = false;

    // Remove this module from the initiators of old deps, so we can populate a
    // fresh cache
    this.dependencies.forEach(tModule => {
      tModule.initiators.delete(this);
    });
    this.transpilationDependencies.forEach(tModule => {
      tModule.transpilationInitiators.delete(this);
    });
    this.childModules.forEach(tModule => {
      tModule.dispose(manager);
    });
    this.dependencies.clear();
    this.transpilationDependencies.clear();
    this.childModules.length = 0;
    this.errors = [];
    this.warnings = [];

    let code = this.module.code || '';
    let finalSourceMap = null;

    const requires = this.module.requires;
    if (requires != null) {
      // We now know that this has been transpiled on the server, so we shortcut
      const loaderContext = this.getLoaderContext(manager, {});
      // These are precomputed requires, for npm dependencies
      requires.forEach(r => loaderContext.addDependency(r));

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
        loaderContext.remainingRequests = transpilers
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

          // Compilation should also be reset, since the code will be different now
          // we don't have a transpilation.
          this.resetCompilation();
          manager.clearCache();

          throw e;
        }
        debug(`Transpiled '${this.getId()}' in ${Date.now() - t}ms`);
      }
    }

    const sourceEqualsCompiled = code === this.module.code;
    const sourceURL = `//# sourceURL=${location.origin}${this.module.path}${
      this.query ? `?${this.hash}` : ''
    }`;

    // Add the source of the file by default, this is important for source mapping
    // errors back to their origin
    code = `${code}\n${sourceURL}`;

    this.source = new ModuleSource(
      this.module.path,
      code,
      finalSourceMap,
      sourceEqualsCompiled
    );

    if (
      this.previousSource &&
      this.previousSource.compiledCode !== this.source.compiledCode
    ) {
      const hasHMR = manager.preset
        .getLoaders(this.module, this.query)
        .some(
          t =>
            t.transpiler.HMREnabled == null ? true : t.transpiler.HMREnabled
        );

      if (!hasHMR) {
        manager.markHardReload();
      } else {
        this.resetCompilation();
      }
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

  evaluate(
    manager: Manager,
    { asUMD = false }: { asUMD: boolean } = {},
    initiator?: TranspiledModule
  ) {
    if (this.source == null) {
      if (this.module.path === '/node_modules/empty/index.js') {
        return {};
      }

      if (this.module.path.startsWith('/node_modules')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[WARN] Sandpack: loading an untranspiled module: ${
              this.module.path
            }`
          );
        }
        // This code is probably required as a dynamic require. Since we can
        // assume that node_modules dynamic requires are only done for node
        // utilites we will just set the transpiled code according to how
        // node handles that.

        let code = this.module.path.endsWith('.json')
          ? `module.exports = JSON.parse(${JSON.stringify(this.module.code)})`
          : this.module.code;

        code += `\n//# sourceURL=${location.origin}${this.module.path}${
          this.query ? `?${this.hash}` : ''
        }`;

        this.source = new ModuleSource(this.module.path, code, null);

        if (initiator) {
          initiator.dependencies.add(this);
          this.initiators.add(initiator);
        }
      } else {
        // This scenario only happens when we are in an inconsistent state, the quickest way to solve
        // this state is to just hard reload everything.
        manager.clearCache();

        throw new Error(`${this.module.path} hasn't been transpiled yet.`);
      }
    }

    const localModule = this.module;

    if (manager.webpackHMR) {
      if (!this.compilation) {
        const shouldReloadPage = this.hmrConfig
          ? this.hmrConfig.isDeclined(this.isEntry)
          : this.isEntry && !this.isTestFile;

        if (shouldReloadPage) {
          if (manager.isFirstLoad) {
            // We're in a reload loop! Ignore all caches!

            manager.clearCache();
            manager.deleteAPICache();
          }

          location.reload();
          return {};
        }
      } else if (
        !this.isTestFile &&
        (!this.hmrConfig || !this.hmrConfig.isDirty())
      ) {
        return this.compilation.exports;
      }
    } else if (this.compilation && this.compilation.exports && !this.isEntry) {
      return this.compilation.exports;
    }

    if (this.hmrConfig) {
      /* eslint-disable no-param-reassign */
      manager.setHmrStatus('dispose');
      // Call module.hot.dispose handler
      // https://webpack.js.org/api/hot-module-replacement/#dispose-or-adddisposehandler-
      this.hmrConfig.callDisposeHandler();
      manager.setHmrStatus('idle');
      /* eslint-enable */
    }

    const hotData = this.hmrConfig ? this.hmrConfig.data : undefined;

    this.compilation = this.compilation || {
      id: this.getId(),
      exports: {},
      hot: {
        accept: (path: string | Array<string>, cb) => {
          if (
            typeof path === 'undefined' ||
            (typeof path !== 'string' || !Array.isArray(path))
          ) {
            // Self mark hot
            this.hmrConfig = this.hmrConfig || new HMR();
            if (this.hmrConfig) {
              const hmrConfig = this.hmrConfig;
              hmrConfig.setType('accept');
              hmrConfig.setSelfAccepted(true);
            }
          } else {
            const paths = typeof path === 'string' ? [path] : path;

            paths.forEach(p => {
              const tModule = manager.resolveTranspiledModule(
                p,
                this.module.path
              );

              tModule.hmrConfig = tModule.hmrConfig || new HMR();
              const hmrConfig = tModule.hmrConfig;
              hmrConfig.setType('accept');
              hmrConfig.setAcceptCallback(cb);
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
        status: () => manager.hmrStatus,
        addStatusHandler: manager.addStatusHandler,
        removeStatusHandler: manager.removeStatusHandler,
      },
    };
    this.compilation.hot.data = hotData;

    const transpiledModule = this;

    try {
      // eslint-disable-next-line no-inner-declarations
      function require(path: string) {
        if (path === '') {
          throw new Error('Cannot import an empty path');
        }

        const usedPath = manager.getPresetAliasedPath(path);
        const bfsModule = BrowserFS.BFSRequire(usedPath);

        if (path === 'os') {
          const os = require('os-browserify');
          os.homedir = () => '/home/sandbox';
          return os;
        }

        if (bfsModule) {
          return bfsModule;
        }

        if (path === 'module') {
          return class NodeModule {
            filename = undefined;
            id = undefined;
            loaded = false;

            static _resolveFilename(toPath: string, module) {
              if (module.filename == null) {
                throw new Error('Module has no filename');
              }

              const m = manager.resolveModule(toPath, module.filename);
              return m.path;
            }

            static _nodeModulePaths() {
              return [];
            }
          };
        }

        // So it must be a dependency
        if (path.startsWith('codesandbox-api')) {
          return resolveDependency(path, manager.externals);
        }

        const requiredTranspiledModule = manager.resolveTranspiledModule(
          path,
          localModule.path
        );

        // Check if this module has been evaluated before, if so return the exports
        // of that compilation
        const cache = requiredTranspiledModule.compilation;

        return cache
          ? cache.exports
          : manager.evaluateTranspiledModule(
              requiredTranspiledModule,
              transpiledModule
            );
      }

      require.resolve = function resolve(path: string) {
        const foundModule = manager.resolveModule(path, localModule.path);

        return foundModule.path;
      };

      const globals = manager.testRunner.testGlobals(this.module);

      globals.__dirname = pathUtils.dirname(this.module.path);
      globals.__filename = this.module.path;

      const exports = evaluate(
        this.source.compiledCode,
        require,
        this.compilation,
        manager.envVariables,
        globals,
        { asUMD }
      );

      /* eslint-disable no-param-reassign */
      manager.setHmrStatus('apply');
      const hmrConfig = this.hmrConfig;
      if (hmrConfig && hmrConfig.isHot()) {
        hmrConfig.setDirty(false);
        hmrConfig.callAcceptCallback();
      }
      manager.setHmrStatus('idle');
      /* eslint-enable */

      return exports;
    } catch (e) {
      e.tModule = e.tModule || transpiledModule;

      this.resetCompilation();

      throw e;
    }
  }

  postTranspile(manager: Manager) {
    if (
      this.initiators.size === 0 &&
      this.transpilationInitiators.size === 0 &&
      !this.isEntry &&
      !manager.isFirstLoad
    ) {
      // Remove the module from the transpiler if it's not used anymore
      debug(`Removing '${this.getId()}' from manager.`);
      this.dispose(manager);
    }
  }

  postEvaluate(manager: Manager) {
    // Question: do we need to disable this for HMR projects?
    // For non cacheable transpilers we remove the cached evaluation
    if (
      manager.preset
        .getLoaders(this.module, this.query)
        .some(
          t =>
            t.transpiler.cacheable == null ? false : !t.transpiler.cacheable
        )
    ) {
      debug(`Removing '${this.getId()}' cache as it's not cacheable.`);
      this.compilation = null;
    }
  }

  serialize(optimizeForSize: boolean = true): SerializedTranspiledModule {
    const serializableObject = {};

    const sourceEqualsCompiled =
      this.source && this.source.sourceEqualsCompiled;

    serializableObject.query = this.query;
    serializableObject.assets = this.assets;
    serializableObject.module = this.module;
    serializableObject.emittedAssets = this.emittedAssets;
    serializableObject.isEntry = this.isEntry;
    serializableObject.isTestFile = this.isTestFile;
    if (!sourceEqualsCompiled || !optimizeForSize) {
      serializableObject.source = this.source;
    }
    serializableObject.sourceEqualsCompiled = sourceEqualsCompiled;
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
    state: { [id: string]: TranspiledModule },
    manager: Manager
  ) {
    this.query = data.query;
    this.assets = data.assets;
    this.module = data.module;
    this.emittedAssets = data.emittedAssets;
    this.isEntry = data.isEntry;
    this.isTestFile = data.isTestFile;

    if (data.sourceEqualsCompiled) {
      this.source = new ModuleSource(
        this.module.path,
        this.module.code,
        null,
        true
      );
    } else {
      this.source = data.source;
    }

    const getModule = (depId: string) => {
      if (state[depId]) {
        return state[depId];
      }

      const [path, ...queryParts] = depId.split(':');
      const query = queryParts.join(':');

      const module = manager.transpiledModules[path].module;
      return manager.getTranspiledModule(module, query);
    };

    const loadModule = (
      depId: string,
      initiator = false,
      transpilation = false
    ) => {
      const tModule = getModule(depId);

      if (initiator) {
        if (transpilation) {
          tModule.transpilationDependencies.add(this);
        } else {
          tModule.dependencies.add(this);
        }
      } else {
        if (transpilation) {
          tModule.transpilationInitiators.add(this);
        } else {
          tModule.initiators.add(this);
        }
      }

      return tModule;
    };

    data.dependencies.forEach((depId: string) => {
      this.dependencies.add(loadModule(depId));
    });
    data.childModules.forEach((depId: string) => {
      this.childModules.push(loadModule(depId));
    });
    data.initiators.forEach((depId: string) => {
      this.initiators.add(loadModule(depId, true));
    });
    data.transpilationDependencies.forEach((depId: string) => {
      this.transpilationDependencies.add(loadModule(depId, false, true));
    });
    data.transpilationInitiators.forEach((depId: string) => {
      this.transpilationInitiators.add(loadModule(depId, true, true));
    });

    data.asyncDependencies.forEach((depId: string) => {
      this.asyncDependencies.push(Promise.resolve(loadModule(depId)));
    });
  }
}
