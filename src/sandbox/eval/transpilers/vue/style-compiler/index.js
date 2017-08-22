// @flow
import Transpiler from '../../';
import { type LoaderContext } from '../../../transpiled-module';

class VueStyleCompiler extends Transpiler {
  constructor() {
    super('vue-style-loader');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import('./loader').then(loader =>
      loader.default(code, loaderContext),
    );
  }
}

const transpiler = new VueStyleCompiler();

export { VueStyleCompiler };

export default transpiler;
