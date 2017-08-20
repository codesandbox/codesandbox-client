// @flow
import Transpiler from '../';
import { type LoaderContext } from '../../TranspiledModule';

import loader from './loader';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class VueTranspiler extends Transpiler {
  doTranspilation(code: string, loaderContext: LoaderContext) {
    const transpiledCode = loader(code, loaderContext);

    return Promise.resolve({ transpiledCode });
  }
}

const transpiler = new VueTranspiler();

export { VueTranspiler };

export default transpiler;
