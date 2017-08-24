// @flow
import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class VueTranspiler extends Transpiler {
  constructor() {
    super('vue-loader');
  }
  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import('./loader').then(loader => {
      const transpiledCode = loader.default(code, loaderContext);

      return Promise.resolve({ transpiledCode });
    });
  }
}

const transpiler = new VueTranspiler();

export { VueTranspiler };

export default transpiler;
