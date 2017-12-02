// @flow

import type { SourceMap } from './utils/get-source-map';
import { type LoaderContext } from '../transpiled-module';

type TranspilerResult = {
  transpiledCode: string,
  ast?: Object,
  sourceMap?: SourceMap,
};

export default class Transpiler {
  cachedResults: {
    [id: string]: TranspilerResult,
  };
  cacheable: boolean;
  name: string;

  constructor(name: string) {
    this.cachedResults = {};
    this.cacheable = true;
    this.name = name;
  }

  /* eslint-disable */
  initialize() {}

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
    return this.doTranspilation(code, loaderContext).then(result => {
      this.cachedResults[code] = result;
      return result;
    });
  }
}
