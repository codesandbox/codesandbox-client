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
    module: TranspiledModule,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    throw new Error('This is an abstract function, please override it!');
  }
  /* eslint-enable */

  transpile(
    module: TranspiledModule,
    loaderContext: LoaderContext,
  ): Promise<TranspilerResult> {
    if (
      this.cachedResults[module.module.id] &&
      this.cachedResults[module.module.id].code === module.module.code
    ) {
      return Promise.resolve(this.cachedResults[module.module.id]);
    }

    return this.doTranspilation(module, loaderContext).then(result => {
      // Add the source of the file by default, this is important for source mapping
      // errors back to their origin

      // eslint-disable-next-line no-param-reassign
      result.transpiledCode = `${result.transpiledCode}\n//# sourceURL=${loaderContext.path}`;

      this.cachedResults[module.module.id] = result;
      return result;
    });
  }
}
