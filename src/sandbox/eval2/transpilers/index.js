// @flow

import type { SourceMap } from './utils/get-source-map';
import TranspiledModule, { type LoaderContext } from '../TranspiledModule';

type TranspilerResult = {
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
    code: string,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    throw new Error('This is an abstract function, please override it!');
  }
  /* eslint-enable */

  transpile(
    code: string,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    if (this.cachedResults[code]) {
      return Promise.resolve(this.cachedResults[code]);
    }

    return this.doTranspilation(code, loaderContext).then(result => {
      // Add the source of the file by default, this is important for source mapping
      // errors back to their origin

      // eslint-disable-next-line no-param-reassign
      result.transpiledCode = `${result.transpiledCode}\n//# sourceURL=${loaderContext.path}`;

      this.cachedResults[code] = result;
      return result;
    });
  }
}
