// @flow

import type { SourceMap } from './utils/get-source-map';
import { type LoaderContext } from '../transpiled-module';
import type { default as Manager } from '../manager';

type TranspilerResult = {
  transpiledCode: string,
  ast?: Object,
  sourceMap?: SourceMap,
};

export default class Transpiler {
  cacheable: boolean;
  name: string;
  HMREnabled: boolean;

  constructor(name: string) {
    this.cacheable = true;
    this.name = name;
    this.HMREnabled = true;
  }

  /* eslint-disable */
  initialize() {}

  dispose() {}

  cleanModule(loaderContext: LoaderContext) {}

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    throw new Error('This is an abstract function, please override it!');
  }
  /* eslint-enable */

  transpile(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult> {
    return this.doTranspilation(code, loaderContext);
  }

  /**
   * Get custom info of the current transpiler, this is open for implementation
   * per transpiler
   */
  getTranspilerContext(manager: Manager): Promise<Object> {
    return Promise.resolve({
      name: this.name,
      HMREnabled: this.HMREnabled,
      cacheable: this.cacheable,
    });
  }
}
