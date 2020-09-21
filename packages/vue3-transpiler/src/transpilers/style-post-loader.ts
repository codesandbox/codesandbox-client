import Transpiler, { TranspilerResult } from 'app/src/sandbox/eval/transpilers';
import { LoaderContext } from 'app/src/sandbox/eval/transpiled-module';

import stylePostLoader from '../stylePostLoader';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class VueV3StylePostLoader extends Transpiler {
  constructor() {
    super('vue-style-post-loader');
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): TranspilerResult {
    return stylePostLoader(code, loaderContext);
  }
}

const transpiler = new VueV3StylePostLoader();

export { VueV3StylePostLoader };

export default transpiler;
