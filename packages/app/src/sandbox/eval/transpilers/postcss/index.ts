import { LoaderContext, Transpiler } from 'sandpack-core';

const FEATURE_REGEX = /@import|@url/;

/**
 * Mainly responsible for inlining css imports
 */
class PostCSSCompiler extends Transpiler {
  constructor() {
    super('postcss-compiler');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    if (!FEATURE_REGEX.test(code)) {
      return Promise.resolve({ transpiledCode: code });
    }
    return import(
      /* webpackChunkName: 'postcss-compiler' */ './loader'
    ).then(loader => loader.default(code, loaderContext));
  }
}

const transpiler = new PostCSSCompiler();

export { PostCSSCompiler };

export default transpiler;
