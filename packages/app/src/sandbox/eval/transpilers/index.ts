import { SourceMap } from './utils/get-source-map';
import { LoaderContext } from '../transpiled-module';
import Manager from '../manager';

export interface TranspilerResult {
  transpiledCode: any;
  ast?: Object;
  sourceMap?: SourceMap;
}

export default abstract class Transpiler {
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

  abstract doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): Promise<TranspilerResult>;
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
  getTranspilerContext(manager: Manager): Promise<object> {
    return Promise.resolve({
      name: this.name,
      HMREnabled: this.HMREnabled,
      cacheable: this.cacheable,
    });
  }
}
