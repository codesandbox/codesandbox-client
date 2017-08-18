// @flow
import type { Module, Sandbox } from 'common/types';
import Manager, { type TranspiledModule } from '../presets';

export class CompiledModule {
  module: Module;
  exports: any;
  dependencies: Array<Module>;
  parents: Array<Module>;

  constructor(module: Module) {
    this.module = module;

    this.exports = null;
    this.dependencies = [];
    this.parents = [];
  }

  addDependency = (module: Module) => {
    this.dependencies.push(module);
  };
}

export default class Loader {
  evaluate: (
    sandbox: Sandbox,
    module: TranspiledModule,
    manager: Manager,
  ) => any;
  test: (sandbox: Sandbox, module: Module) => boolean;
  specifity: 0 | 1 | 2;
  deleteCache: (module: Module) => boolean;

  /**
   * The modules this module relies on, should be direct imports. Think about
   * config files, or requires. This is used to determine what to invalidate
   * when hot module reloading.
   */
  dependencies: Array<Module>;

  cachedModules: {
    [id: string]: Object,
  };

  constructor() {
    this.cachedModules = {};
    this.dependencies = [];
  }

  addDependency(module: Module) {
    this.dependencies.push(module);
  }
}
