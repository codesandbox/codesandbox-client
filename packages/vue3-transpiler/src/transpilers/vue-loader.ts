import Transpiler, { TranspilerResult } from 'app/src/sandbox/eval/transpilers';
import { LoaderContext } from 'app/src/sandbox/eval/transpiled-module';
import loader from '../';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class VueV3Transpiler extends Transpiler {
  constructor() {
    super('vue-loader');
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): TranspilerResult {
    return loader(code, loaderContext);
  }
}

const transpiler = new VueV3Transpiler();

export { VueV3Transpiler };

export default transpiler;
