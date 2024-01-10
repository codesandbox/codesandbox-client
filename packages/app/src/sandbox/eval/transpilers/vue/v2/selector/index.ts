import { LoaderContext } from 'sandpack-core/lib/transpiled-module';
import { Transpiler } from 'sandpack-core/lib/transpiler';

class VueSelector extends Transpiler {
  constructor() {
    super('vue-selector');
  }

  doTranspilation(content: string, loaderContext: LoaderContext) {
    return import(
      /* webpackChunkName: 'vue-selector' */ './loader'
    ).then(loader => loader.default(content, loaderContext));
  }
}

const transpiler = new VueSelector();

export { VueSelector };

export default transpiler;
