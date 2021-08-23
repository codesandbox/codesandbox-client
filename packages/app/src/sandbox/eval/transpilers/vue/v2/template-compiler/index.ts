import { LoaderContext, Transpiler } from 'sandpack-core';

class VueTemplateTranspiler extends Transpiler {
  constructor() {
    super('vue-template-compiler');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const loader = await import(
      /* webpackChunkName: 'vue-template-compiler' */ './loader'
    );
    const transpiledCode = await loader.default(code, loaderContext);
    return { transpiledCode };
  }
}

const transpiler = new VueTemplateTranspiler();

export { VueTemplateTranspiler };

export default transpiler;
