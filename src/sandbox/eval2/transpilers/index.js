// @flow

import type { Sandbox, Module } from 'common/types';
import type { SourceMap } from './utils/get-source-map';
import TranspileModule, { type LoaderContext } from '../TranspileModule';

type TranspilerResult = {
  code: string,
  transpiledCode: string,
  ast?: Object,
  sourceMap?: SourceMap,
};

export default class Transpiler {
  cachedResults: {
    [id: string]: TranspilerResult,
  };

  constructor() {
    this.cachedResults = {};
  }

  /* eslint-disable */
  initialize() {}

  dispose() {}

  doTranspilation(
    sandbox: Sandbox,
    module: TranspileModule,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    throw new Error('This is an abstract function, please override it!');
  }
  /* eslint-enable */

  transpile(
    sandbox: Sandbox,
    module: TranspileModule,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    if (
      this.cachedResults[module.id] &&
      this.cachedResults[module.id].code === module.code
    ) {
      return Promise.resolve(this.cachedResults[module.id]);
    }

    return this.doTranspilation(sandbox, module, loaderContext).then(result => {
      this.cachedResults[module.id] = result;
      return result;
    });
  }
}
