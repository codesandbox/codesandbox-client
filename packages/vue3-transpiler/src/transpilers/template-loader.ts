import Transpiler, { TranspilerResult } from 'app/src/sandbox/eval/transpilers';
import { LoaderContext } from 'app/src/sandbox/eval/transpiled-module';

import templateLoader from '../templateLoader';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

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
