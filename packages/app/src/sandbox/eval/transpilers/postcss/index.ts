import Transpiler from '..';
import { LoaderContext } from '../../transpiled-module';

/**
 * Mainly responsible for inlining css imports
 */
class PostCSSCompiler extends Transpiler {
  constructor() {
    super('postcss-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(
      /* webpackChunkName: 'postcss-compiler' */ './loader'
    ).then(loader => loader.default(code, loaderContext));
  }
}

const transpiler = new PostCSSCompiler();

export { PostCSSCompiler };

export default transpiler;
