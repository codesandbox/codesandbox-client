// @flow
import type { Module } from 'common/types';
import getModulePath from 'common/sandbox/get-module-path';

import type { SourceMap } from './transpilers/utils/get-source-map';
import Transpiler from './transpilers';
import ModuleError from './errors/module-error';
import ModuleWarning from './errors/module-warning';

import Manager from './Manager';

type ChildModule = Module & {
  parent: Module,
};

class ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: ?SourceMap;

  constructor(fileName: string, compiledCode: string, sourceMap: SourceMap) {
    this.fileName = fileName;
    this.compiledCode = compiledCode;
    this.sourceMap = sourceMap;
  }
}

export type LoaderContext = {
  version: number,
  emitWarning: (warning: string) => void,
  emitError: (error: string) => void,
  emitModule: (append: string, code: string) => void,
  emitFile: (name: string, content: string, sourceMap: SourceMap) => void,
  options: {
    context: '/',
  },
  webpack: boolean,
  sourceMap: boolean,
  target: string,
  path: string,
  _module: TranspileModule, // eslint-disable-line no-use-before-define
};

export default class TranspileModule {
  module: Module;
  source: ModuleSource;
  cacheable: boolean;
  assets: {
    [name: string]: ModuleSource,
  };
  childModules: Array<TranspileModule>;

  errors: Array<ModuleError>;
  warnings: Array<ModuleWarning>;
  job: Promise;

  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: Array<ModuleSource>;

  constructor(module: Module) {
    this.module = module;
    this.errors = [];
    this.warnings = [];
    this.cacheable = true;
    this.childModules = [];
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
    );

    return {
      version: 2,
      emitWarning: warning => {
        this.warnings.push(new ModuleWarning(this, warning));
      },
      emitError: error => {
        this.errors.push(new ModuleError(this, error));
      },
      emitModule: (append: string, code: string) => {
        // Copy the module info, with new name
        const moduleCopy: ChildModule = {
          ...this.module,
          id: `${this.module.id}:${append}`,
          shortid: `${this.module.shortid}:${append}`,
          title: `${this.module.title}:${append}`,
          parent: this.module,
          code,
        };

        const transpileModule = manager.addModule(moduleCopy);
        this.childModules.push(transpileModule);
      },
      emitFile: (name: string, content: string, sourceMap: SourceMap) => {
        this.assets[name] = this.createSourceForAsset(name, content, sourceMap);
      },
      options: {
        context: '/',
      },
      webpack: true,
      sourceMap: true,
      target: 'web',
      _module: this,
      path,
      fs: () => {
        console.log('fs has been used');
      },
    };
  }

  transpile(manager: Manager) {
    // For now we only support one transpiler per module
    const [transpiler] = manager.preset.getTranspilers(this.module);

    return transpiler
      .transpile(manager.sandbox, this, this.getLoaderContext(manager))
      .then(({ transpiledCode, sourceMap }) => {
        this.source = new ModuleSource(
          this.module.title,
          transpiledCode,
          sourceMap,
        );
      });
  }

  getChildModules() {
    return [...this.childModules.map(m => [m.module, m.getChildModules()])];
  }
}
