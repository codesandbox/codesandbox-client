// @flow
import type { Module, Sandbox } from 'common/types';
import type { TranspiledModule } from '../presets';

export default class Loader {
  evaluate: (sandbox: Sandbox, module: TranspiledModule) => any;
  test: (sandbox: Sandbox, module: Module) => boolean;
  specifity: 0 | 1 | 2;
  deleteCache: (module: Module) => boolean;

  cachedModules: {
    [id: string]: Object,
  };

  constructor() {
    this.cachedModules = {};
  }
}
