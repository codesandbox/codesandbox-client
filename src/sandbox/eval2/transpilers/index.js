// @flow

import type { Sandbox, Module } from 'common/types';
import type { SourceMap } from './utils/get-source-map';

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

  doTranspilation(sandbox: Sandbox, module: Module): Promise<TranspilerResult> {
    throw new Error('This is an abstract function, please override it!');
  }

  test = (module: Module) => false;
  /* eslint-enable */

  transpile(sandbox: Sandbox, module: Module): Promise<TranspilerResult> {
    if (
      this.cachedResults[module.id] &&
      this.cachedResults[module.id].code === module.code
    ) {
      return Promise.resolve(this.cachedResults[module.id]);
    }

    return this.doTranspilation(sandbox, module).then(result => {
      this.cachedResults[module.id] = result;
      return result;
    });
  }
}
