// @flow
import type { Module, Directory, Sandbox } from 'common/types';
import { flatten } from 'lodash';

import TranspileModule from './TranspileModule';
import Preset from './presets';

type NormalizedSandbox = Sandbox & {
  modules: Array<Module>,
  directories: Array<Directory>,
};

// TODO rename to compiler
export default class Manager {
  transpileModules: {
    [id: string]: TranspileModule,
  };
  sandbox: NormalizedSandbox;
  preset: Preset;

  constructor(sandbox: NormalizedSandbox, preset: Preset) {
    this.sandbox = sandbox;
    this.preset = preset;

    this.sandbox.modules.forEach(module => {
      this.addModule(module);
    });
  }

  addModule(module: Module) {
    const transpileModule = new TranspileModule(module);

    this.transpileModules[module.id] = transpileModule;
    return transpileModule;
  }

  getTranspileModule(module: Module): TranspileModule {
    let transpileModule = this.transpileModules[module.id];

    if (!transpileModule) {
      transpileModule = new TranspileModule(module);
      this.transpileModules[module.id] = transpileModule;
    }

    transpileModule.transpile(this);
    return transpileModule;
  }

  getTranspileModules() {
    const transpileModuleValues = Object.keys(this.transpileModules).map(
      key => this.transpileModules[key],
    );
    return [
      ...transpileModuleValues,
      ...flatten(transpileModuleValues.map(m => m.getChildModules())),
    ];
  }

  transpileModule(module: Module): TranspileModule {
    const transpilers = this.preset.getTranspilers(module);

    return this.getTranspileModule(module).transpile(transpilers);
  }

  transpileAllModules() {
    this.sandbox.modules.forEach(module => {
      this.transpileModule(module);
    });
  }

  getModules() {
    const sandboxModules = this.sandbox.modules.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {},
    );
    const transpiledModules = this.g;
  }
}
