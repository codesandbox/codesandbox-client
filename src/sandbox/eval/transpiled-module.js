// @flow
import type { Module } from 'common/types';
import { flatten } from 'lodash';
import getModulePath from 'common/sandbox/get-module-path';

import type { SourceMap } from './transpilers/utils/get-source-map';
import ModuleError from './errors/module-error';
import ModuleWarning from './errors/module-warning';

import resolveDependency from './loaders/dependency-resolver';
import evaluate from './loaders/eval';

import Manager from './manager';

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

export type LoaderContext = {
  version: number,
  emitWarning: (warning: string) => void,
  emitError: (error: Error) => void,
  emitModule: (append: string, code: string) => string,
  emitFile: (name: string, content: string, sourceMap: SourceMap) => void,
  options: {
    context: '/',
  },
  webpack: boolean,
  sourceMap: boolean,
  target: string,
  path: string,
  getModules: () => Array<Module>,
  resolvePath: (module: Module) => string,
  addDependency: (
    depPath: string,
    directoryShortid?: ?string,
  ) => TranspiledModule,
  _module: TranspiledModule, // eslint-disable-line no-use-before-define
};

class Compilation {
  exports: any;

  constructor() {
    this.exports = null;
  }
}

export default class TranspiledModule {
  module: Module;
  source: ?ModuleSource;
  cacheable: boolean;
  assets: {
    [name: string]: ModuleSource,
  };
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

  constructor(module: Module) {
    this.module = module;
    this.errors = [];
    this.warnings = [];
    this.cacheable = true;
    this.childModules = [];
    this.dependencies = new Set();
    this.initiators = new Set();
  }

  dispose() {
    this.reset();
  }

  reset() {
    this.childModules = [];
    this.errors = [];
    this.warnings = [];
    this.emittedAssets = [];
    this.resetCompilation();
    this.resetTranspilation();
  }

  resetTranspilation() {
    this.source = null;
  }

  resetCompilation() {
    try {
      this.initiators.forEach(dep => {
        dep.resetCompilation();
      });
      this.compilation = null;
    } catch (e) {
      console.error(e);
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
    sourceMap: SourceMap,
  ) => new ModuleSource(name, content, sourceMap);

  getLoaderContext(manager: Manager): LoaderContext {
    const path = getModulePath(
      manager.getModules(),
      manager.getDirectories(),
      this.module.id,
    ).replace('/', '');

    const [realPath, optionString] = path.split('?');

    return {
      version: 2,
      emitWarning: warning => {
        this.warnings.push(new ModuleWarning(this, warning));
      },
      emitError: error => {
        this.errors.push(new ModuleError(this, error));
      },
      emitModule: (append: string, code: string) => {
        const title = `${this.module.title}:${append}`;
        // Copy the module info, with new name
        const moduleCopy: ChildModule = {
          ...this.module,
          id: `${this.module.id}:${append}`,
          shortid: `${this.module.shortid}:${append}`,
          title,
          parent: this.module,
          code,
        };

        const transpiledModule = manager.addModule(moduleCopy);
        transpiledModule.transpile(manager);
        this.childModules.push(transpiledModule);

        return title;
      },
      emitFile: (name: string, content: string, sourceMap: SourceMap) => {
        this.assets[name] = this.createSourceForAsset(name, content, sourceMap);
      },
      addDependency: (depPath: string, directoryShortid) => {
        const tModule = manager.resolveTranspiledModule(
          depPath,
          directoryShortid,
        );
        this.dependencies.add(tModule);
        tModule.initiators.add(this);

        return tModule;
      },
      getModules: (): Array<Module> => manager.getModules(),
      resolvePath: (module: Module) => {
        // We have to split the options off
        const [name] = getModulePath(
          manager.getModules(),
          manager.getDirectories(),
          module.id,
        )
          .replace('/', '')
          .split('?');

        return name;
      },
      options: {
        context: '/',
        ...(optionString ? JSON.parse(optionString) : {}),
      },
      webpack: true,
      sourceMap: true,
      target: 'web',
      _module: this,
      path: realPath,
    };
  }

  async transpile(manager: Manager) {
    const transpilers = manager.preset.getTranspilers(this.module);
    const cacheable = transpilers.every(t => t.cacheable);

    if (this.source && cacheable) {
      return this;
    }

    const loaderContext = this.getLoaderContext(manager);

    let code = this.module.code || '';
    let finalSourceMap = null;
    for (let i = 0; i < transpilers.length; i += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const { transpiledCode, sourceMap } = await transpilers[i].transpile(
          code,
          loaderContext,
        );
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

    // Add the source of the file by default, this is important for source mapping
    // errors back to their origin
    code = `${code}\n//# sourceURL=${loaderContext.path}`;

    await Promise.all(this.childModules.map(t => t.transpile(manager)));

    this.source = new ModuleSource(this.module.title, code, finalSourceMap);
    return this;
  }

  getChildTranspiledModules(): Array<TranspiledModule> {
    return flatten(
      this.childModules.map(m => [m, ...m.getChildTranspiledModules()]),
    );
  }

  getChildModules(): Array<Module> {
    return flatten(
      this.childModules.map(m => [m.module, ...m.getChildModules()]),
    );
  }

  evaluate(manager: Manager, parentModules: Array<TranspiledModule>) {
    if (this.source == null) {
      throw new Error(`${this.module.title} hasn't been transpiled yet.`);
    }

    const module = this.module;

    const transpilers = manager.preset.getTranspilers(module);
    const cacheable = transpilers.every(t => t.cacheable);

    const transpiledModule = this;
    const compilation = new Compilation();

    // Remove this module from the initiators of old deps, so we can populate a
    // fresh cache
    this.dependencies.forEach(tModule => {
      tModule.initiators.delete(transpiledModule);
    });

    this.dependencies.clear();
    this.initiators = new Set(parentModules);
    try {
      function require(path: string) {
        // eslint-disable-line no-unused-vars
        if (/^(\w|@)/.test(path)) {
          // So it must be a dependency
          return resolveDependency(path, manager.externals);
        }

        const requiredTranspiledModule = manager.resolveTranspiledModule(
          path,
          module.directoryShortid,
        );

        if (requiredTranspiledModule == null)
          throw new Error(`Cannot find module in path: ${path}`);

        if (module === requiredTranspiledModule.module) {
          throw new Error(`${module.title} is importing itself`);
        }

        transpiledModule.dependencies.add(requiredTranspiledModule);

        // Check if this module has been evaluated before, if so return the exports
        // of that compilation
        const cache = requiredTranspiledModule.compilation;
        requiredTranspiledModule.initiators.add(transpiledModule);

        // This is a cyclic dependency, we should return undefined for first
        // execution according to ES module spec
        if (parentModules.includes(requiredTranspiledModule) && !cache) {
          return undefined;
        }

        return cache
          ? cache.exports
          : manager.evaluateModule(requiredTranspiledModule.module, [
              ...parentModules,
              transpiledModule,
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

    if (this.initiators.size === 0) {
      manager.preset
        .getTranspilers(this.module)
        .forEach(t => t.cleanModule(this.getLoaderContext(manager)));
    }
  }
}
