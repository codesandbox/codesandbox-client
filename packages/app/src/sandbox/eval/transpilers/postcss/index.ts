import { LoaderContext, Transpiler } from 'sandpack-core';

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
