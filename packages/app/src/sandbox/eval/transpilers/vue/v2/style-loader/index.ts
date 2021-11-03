import { LoaderContext, Transpiler } from 'sandpack-core';

import loader from './loader';

class VueStyleLoader extends Transpiler {
  constructor() {
    super('vue-style-loader');
  }

  async doTranspilation(content: string, loaderContext: LoaderContext) {
    const transpiledCode = await loader(content, loaderContext);

    return { transpiledCode };
  }
}

const transpiler = new VueStyleLoader();

export { VueStyleLoader };

export default transpiler;
