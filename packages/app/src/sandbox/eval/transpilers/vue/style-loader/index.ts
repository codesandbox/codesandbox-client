import Transpiler from '../..';
import { LoaderContext } from '../../../transpiled-module';

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
