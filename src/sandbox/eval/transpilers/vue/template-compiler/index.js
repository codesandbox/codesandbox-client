// @flow
import Transpiler from '../../';
import { type LoaderContext } from '../../../transpiled-module';

class VueTemplateTranspiler extends Transpiler {
  constructor() {
    super('vue-template-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import('./loader').then(loader => {
      const transpiledCode = loader.default(code, loaderContext);

      return Promise.resolve({ transpiledCode });
    });
  }
}

const transpiler = new VueTemplateTranspiler();

export { VueTemplateTranspiler };

export default transpiler;
