// @flow
import type { Module } from 'common/types';
import TranspileModule from './TranspileModule';

export default class CompiledModule {
  transpiledModule: TranspileModule;

  dependencies: Array<TranspileModule>;
  initiators: Array<TranspileModule>;
  exports: any;

  constructor(transpiledModule: TranspileModule) {
    this.transpiledModule = transpiledModule;
  }

  updateModule(module: Module) {}
}
