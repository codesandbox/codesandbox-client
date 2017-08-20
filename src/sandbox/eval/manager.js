// @flow
import type { Module, Directory } from 'common/types';
import { flatten, values } from 'lodash';

import TranspiledModule from './transpiled-module';
import Preset from './presets';
import resolveModule from '../../common/sandbox/resolve-module';

type Externals = {
  [name: string]: string,
};

export default class Manager {
  id: string;
  transpiledModules: {
    [id: string]: TranspiledModule,
  };
  preset: Preset;
  externals: Externals;
  modules: Array<Module>;
  directories: Array<Directory>;

  constructor(
    id: string,
    modules: Array<Module>,
    directories: Array<Directory>,
    preset: Preset,
  ) {
    this.id = id;
    this.modules = modules;
    this.directories = directories;
    this.preset = preset;
    this.transpiledModules = {};

    this.modules.forEach(module => {
      this.addModule(module);
    });
  }

  setExternals(externals: Externals) {
    this.externals = externals;
  }

  initialize() {
    return this.transpileAllModules();
  }

  evaluateModule(module: Module, moduleChain: Array<TranspiledModule> = []) {
    const transpiledModule = this.getTranspiledModule(module);

    const exports = transpiledModule.evaluate(this, moduleChain);

    // Run post evaluate first
    this.getTranspiledModules().forEach(t => t.postEvaluate(this));

    return exports;
  }

  addModule(module: Module): TranspiledModule {
    const transpiledModule = new TranspiledModule(module);

    this.transpiledModules[module.id] = transpiledModule;
    return transpiledModule;
  }

  getTranspiledModule(module: Module): TranspiledModule {
    let transpileModule = this.transpiledModules[module.id];

    if (!transpileModule) {
      transpileModule = new TranspiledModule(module);
      this.transpiledModules[module.id] = transpileModule;
    }

    return transpileModule;
  }

  getTranspiledModules() {
    const transpileModuleValues = values(this.transpiledModules);

    return flatten([
      transpileModuleValues,
      ...transpileModuleValues.map(m => m.getChildTranspiledModules()),
    ]);
  }

  transpileModule(module: Module): Promise<TranspiledModule> {
    return this.getTranspiledModule(module).transpile(this);
  }

  transpileAllModules(): Promise<Array<TranspiledModule>> {
    const promises = this.modules.map(module => this.transpileModule(module));
    return Promise.all(promises);
  }

  clearCompiledCache() {
    this.getTranspiledModules().map(tModule => tModule.resetCompilation());
  }

  getModules(): Array<Module> {
    const sandboxModules = this.modules.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {},
    );
    const transpiledModules = this.getTranspiledModules().reduce(
      (prev, next) => ({
        ...prev,
        [next.module.id]: next.module,
      }),
      {},
    );

    return values({ ...sandboxModules, ...transpiledModules });
  }

  getDirectories() {
    return this.directories;
  }

  resolveTranspiledModule(
    path: string,
    startdirectoryShortid: ?string,
  ): TranspiledModule {
    const module = resolveModule(
      path,
      this.getModules(),
      this.getDirectories(),
      startdirectoryShortid,
      this.preset.ignoredExtensions,
    );

    return this.getTranspiledModule(module);
  }

  /**
   * Find all changed, added and deleted modules. Update trees and
   * delete caches accordingly
   */
  updateData(modules: Array<Module>, directories: Array<Directory>) {
    // Create an object with mapping from modules
    const moduleObject = this.modules.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {},
    );

    const addedModules = [];
    const updatedModules = [];
    const deletedModules = [];

    modules.forEach(module => {
      const mirrorModule = moduleObject[module.id];

      if (!mirrorModule) {
        addedModules.push(module);
      } else if (
        mirrorModule.code !== module.code ||
        mirrorModule.title !== module.title ||
        mirrorModule.directoryShortid !== module.directoryShortid
      ) {
        updatedModules.push(module);
      }
    });

    this.modules.forEach(module => {
      const mirrorModule = modules.find(m => m.id === module.id);

      if (!mirrorModule) {
        deletedModules.push(module);
      }
    });

    this.modules = modules;
    this.directories = directories;

    addedModules.forEach(m => this.addModule(m));
    updatedModules.forEach(m => this.getTranspiledModule(m).update(m));

    deletedModules.forEach(m => {
      const transpiledModule = this.getTranspiledModule(m);

      transpiledModule.dispose();
      delete this.transpiledModules[m.id];
    });

    return this.transpileAllModules();
  }
}
