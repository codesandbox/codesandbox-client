// @flow
import Transpiler from '../';
import TranspiledModule, { type LoaderContext } from '../../TranspiledModule';

class RawTranspiler extends Transpiler {
  doTranspilation(module: TranspiledModule, loaderContext: LoaderContext) {
    return Promise.resolve({
      transpiledCode: module.module.code || '',
    });
  }
}

const transpiler = new RawTranspiler();

export { RawTranspiler };

export default transpiler;
