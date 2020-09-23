import { Transpiler, TranspilerResult, LoaderContext } from 'sandpack-core';

import templateLoader from '../templateLoader';

class VueV3TemplateLoader extends Transpiler {
  constructor() {
    super('vue-template-loader');
  }

  doTranspilation(
    code: string,
    loaderContext: LoaderContext
  ): TranspilerResult {
    return templateLoader(code, loaderContext);
  }
}

const transpiler = new VueV3TemplateLoader();

export { VueV3TemplateLoader };

export default transpiler;
