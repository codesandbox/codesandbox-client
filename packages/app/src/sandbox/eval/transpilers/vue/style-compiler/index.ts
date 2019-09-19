import Transpiler from '../..';
import { LoaderContext } from '../../../transpiled-module';

class VueStyleCompiler extends Transpiler {
  constructor() {
    super('vue-style-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(/* webpackChunkName: 'vue-style-compiler' */ './loader').then(
      loader => loader.default(code, loaderContext)
    );
  }
}

const transpiler = new VueStyleCompiler();

export { VueStyleCompiler };

export default transpiler;
