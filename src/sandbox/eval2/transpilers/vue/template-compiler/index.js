// @flow
import Transpiler from '../../';
import { type LoaderContext } from '../../../TranspiledModule';

import loader from './loader';

class VueTemplateTranspiler extends Transpiler {
  doTranspilation(code: string, loaderContext: LoaderContext) {
    const transpiledCode = loader(code, loaderContext);

    return Promise.resolve({ transpiledCode });
  }
}

const transpiler = new VueTemplateTranspiler();

export { VueTemplateTranspiler };

export default transpiler;
