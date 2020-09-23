import { LoaderContext, Transpiler } from 'sandpack-core';

class VueStyleCompiler extends Transpiler {
  constructor() {
    super('vue-style-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(
      /* webpackChunkName: 'vue-style-compiler' */ './loader'
    ).then(loader => loader.default(code, loaderContext));
  }
}

const transpiler = new VueStyleCompiler();

export { VueStyleCompiler };

export default transpiler;
