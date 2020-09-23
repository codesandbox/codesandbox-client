import { LoaderContext, Transpiler } from 'sandpack-core';

import loader from './loader';

class VueStyleLoader extends Transpiler {
  constructor() {
    super('vue-style-loader');
  }

  doTranspilation(content: string, loaderContext: LoaderContext) {
    const transpiledCode = loader(content, loaderContext);

    return Promise.resolve({ transpiledCode });
  }
}

const transpiler = new VueStyleLoader();

export { VueStyleLoader };

export default transpiler;
