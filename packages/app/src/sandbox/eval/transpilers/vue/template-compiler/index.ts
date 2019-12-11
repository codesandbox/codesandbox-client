import Transpiler from '../..';
import { LoaderContext } from '../../../transpiled-module';

class VueTemplateTranspiler extends Transpiler {
  constructor() {
    super('vue-template-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(
      /* webpackChunkName: 'vue-template-compiler' */ './loader'
    ).then(loader => {
      const transpiledCode = loader.default(code, loaderContext);

      return Promise.resolve({ transpiledCode });
    });
  }
}

const transpiler = new VueTemplateTranspiler();

export { VueTemplateTranspiler };

export default transpiler;
