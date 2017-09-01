// @flow
import { flattenDeep } from 'lodash';

import type { Module } from 'common/types';
import getModulePath from 'common/sandbox/get-module-path';

import type { SourceMap } from './transpilers/utils/get-source-map';
import ModuleError from './errors/module-error';
import ModuleWarning from './errors/module-warning';

import resolveDependency from './loaders/dependency-resolver';
import evaluate from './loaders/eval';

import Manager from './manager';

type ChildModule = Module & {
  parent: Module
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

export type LoaderContext = {
  emitWarning: (warning: string) => void,
  emitError: (error: Error) => void,
  emitModule: (
    title: string,
    code: string,
    directoryShortid: ?string
  ) => TranspiledModule, // eslint-disable-line no-use-before-define
  emitFile: (name: string, content: string, sourceMap: SourceMap) => void,
  options: {
    context: '/'
  },
  webpack: boolean,
  sourceMap: boolean,
  target: string,
  path: string,
  getModules: () => Array<Module>,
  resolvePath: (module: Module) => string,
  addDependency: (
    depPath: string,
    options: ?{
      isAbsolute: boolean
    }
  ) => TranspiledModule, // eslint-disable-line no-use-before-define
  addDependenciesInDirectory: (
    depPath: string,
    options: {
      isAbsolute: boolean
    }
  ) => Array<TranspiledModule>, // eslint-disable-line no-use-before-define
  _module: TranspiledModule // eslint-disable-line no-use-before-define
};

class Compilation {
  exports: any;

  constructor() {
    this.exports = null;
  }
}

export default class TranspiledModule {
  module: Module;
  query: string;
  source: ?ModuleSource;
  cacheable: boolean;
  assets: {
    [name: string]: ModuleSource
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
  transpilationDependencies: Set<TranspiledModule>;
  transpilationInitiators: Set<TranspiledModule>;

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
    this.cacheable = true;
    this.childModules = [];
    this.transpilationDependencies = new Set();
    this.dependencies = new Set();
    this.transpilationInitiators = new Set();
    this.initiators = new Set();
    this.isEntry = false;
  }

  getId() {
    return `${this.module.id}:${this.query}`;
  }

  dispose() {
    this.reset();
  }

  reset() {
    this.childModules = [];
    this.errors = [];
    this.warnings = [];
    this.emittedAssets = [];
    this.setIsEntry(false);
    this.resetCompilation();
    this.resetTranspilation();
  }

  resetTranspilation() {
    Array.from(this.transpilationInitiators)
      .filter(t => t.source)
      .forEach(dep => {
        dep.resetTranspilation();
      });
    this.source = null;
  }

  resetCompilation() {
    if (this.compilation) {
      try {
        this.compilation = null;
        Array.from(this.initiators).filter(t => t.compilation).forEach(dep => {
          dep.resetCompilation();
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  update(module: Module): TranspiledModule {
    this.module = module;
    this.reset();

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
    const path = getModulePath(
      manager.getModules(),
      manager.getDirectories(),
      this.module.id
    ).replace('/', '');

    return {
      emitWarning: warning => {
        this.warnings.push(new ModuleWarning(this, warning));
      },
      emitError: error => {
        this.errors.push(new ModuleError(this, error));
      },
      emitModule: (
        title: string,
        code: string,
        directoryShortid = this.module.directoryShortid
      ) => {
        const queryPath = title.split('!');
        // pop() mutates queryPath, queryPath is now just the loaders
        const moduleName = queryPath.pop();

        // Copy the module info, with new name
        const moduleCopy: ChildModule = {
          ...this.module,
          id: `${this.module.id}:${moduleName}`,
          shortid: `${this.module.shortid}:${moduleName}`,
          directoryShortid,
          title: moduleName,
          parent: this.module,
          code
        };

        const transpiledModule = manager.addModule(
          moduleCopy,
          queryPath.join('!')
        );
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
        const tModule = manager.resolveTranspiledModule(
          depPath,
          options && options.isAbsolute ? null : this.module.directoryShortid
        );

        this.transpilationDependencies.add(tModule);
        tModule.transpilationInitiators.add(this);

        return tModule;
      },
      addDependency: (depPath: string, options) => {
        const tModule = manager.resolveTranspiledModule(
          depPath,
          options && options.isAbsolute ? null : this.module.directoryShortid
        );

        this.dependencies.add(tModule);
        tModule.initiators.add(this);

        return tModule;
      },
      addDependenciesInDirectory: (folderPath: string, { isAbsolute } = {}) => {
        const tModules = manager.resolveTranspiledModulesInDirectory(
          folderPath,
          isAbsolute ? null : this.module.directoryShortid
        );

        tModules.forEach(tModule => {
          this.dependencies.add(tModule);
          tModule.initiators.add(this);
        });

        return tModules;
      },
      getModules: (): Array<Module> => manager.getModules(),
      resolvePath: (module: Module) => {
        // We have to split the options off
        const [name] = getModulePath(
          manager.getModules(),
          manager.getDirectories(),
          module.id
        )
          .replace('/', '')
          .split('?');

        return name;
      },
      options: {
        context: '/',
        ...transpilerOptions
      },
      webpack: true,
      sourceMap: true,
      target: 'web',
      _module: this,
      path
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
    if (this.source) {
      return this;
    }

    const transpilers = manager.preset.getLoaders(this.module, this.query);

    // Remove this module from the initiators of old deps, so we can populate a
    // fresh cache
    this.dependencies.forEach(tModule => {
      tModule.initiators.delete(this);
    });
    this.dependencies.clear();
    this.errors = [];
    this.warnings = [];

    let code = this.module.code || '';
    let finalSourceMap = null;
    for (let i = 0; i < transpilers.length; i += 1) {
      const transpilerConfig = transpilers[i];
      const loaderContext = this.getLoaderContext(
        manager,
        transpilerConfig.options || {}
      );
      try {
        const {
          transpiledCode,
          sourceMap
        } = await transpilerConfig.transpiler.transpile(code, loaderContext); // eslint-disable-line no-await-in-loop

        if (this.errors.length) {
          throw this.errors[0];
        }

        code = transpiledCode;
        finalSourceMap = sourceMap;
      } catch (e) {
        e.fileName = loaderContext.path;
        e.module = this.module;
        throw e;
      }
    }

    const path = getModulePath(
      manager.getModules(),
      manager.getDirectories(),
      this.module.id
    ).replace('/', '');
    // Add the source of the file by default, this is important for source mapping
    // errors back to their origin
    code = `${code}\n//# sourceURL=${path}`;

    this.source = new ModuleSource(this.module.title, code, finalSourceMap);

    return Promise.all(
      flattenDeep([
        ...Array.from(this.transpilationInitiators).map(t =>
          t.transpile(manager)
        ),
        ...Array.from(this.dependencies).map(t => t.transpile(manager)),
        ...this.childModules.map(t => t.transpile(manager))
      ])
    );
  }

  getChildTranspiledModules(): Array<TranspiledModule> {
    return flattenDeep(
      this.childModules.map(m => [m, ...m.getChildTranspiledModules()])
    );
  }

  getChildModules(): Array<Module> {
    return flattenDeep(
      this.childModules.map(m => [m.module, ...m.getChildModules()])
    );
  }

  evaluate(manager: Manager, parentModules: Array<TranspiledModule>) {
    if (this.source == null) {
      throw new Error(`${this.module.title} hasn't been transpiled yet.`);
    }

    const module = this.module;

    const transpilers = manager.preset.getLoaders(module, this.query);
    const cacheable = transpilers.every(t => t.transpiler.cacheable);

    const compilation = new Compilation();
    const transpiledModule = this;

    try {
      function require(path: string) {
        // First check if there is an alias for the path, in that case
        // we must alter the path to it
        const aliasedPath = manager.preset.getAliasedPath(path);

        // eslint-disable-line no-unused-vars
        if (/^(\w|@)/.test(aliasedPath) && !aliasedPath.includes('!')) {
          // So it must be a dependency

          return resolveDependency(aliasedPath, manager.externals);
        }

        const requiredTranspiledModule = manager.resolveTranspiledModule(
          aliasedPath,
          module.directoryShortid
        );

        if (module === requiredTranspiledModule.module) {
          throw new Error(`${module.title} is importing itself`);
        }

        // Check if this module has been evaluated before, if so return the exports
        // of that compilation
        const cache = requiredTranspiledModule.compilation;

        // This is a cyclic dependency, we should return undefined for first
        // execution according to ES module spec
        if (parentModules.includes(requiredTranspiledModule) && !cache) {
          return undefined;
        }

        return cache
          ? cache.exports
          : manager.evaluateTranspiledModule(requiredTranspiledModule, [
              ...parentModules,
              transpiledModule
            ]);
      }

      const exports = evaluate(this.source.compiledCode, require);

      compilation.exports = exports;

      if (cacheable) {
        this.compilation = compilation;
      }
      return exports;
    } catch (e) {
      e.module = e.module || module;
      throw e;
    }
  }

  postEvaluate(manager: Manager) {
    // There are no other modules calling this module, so we run a function on
    // all transpilers that clears side effects if there are any. Example:
    // Remove CSS styles from the dom.

    if (this.initiators.size === 0 && !this.isEntry) {
      manager.preset.getLoaders(this.module, this.query).forEach(t => {
        t.transpiler.cleanModule(this.getLoaderContext(manager, t.options));
      });
    }
  }
}
