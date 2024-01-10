import { LoaderContext } from 'sandpack-core/lib/transpiled-module';
import { Transpiler } from 'sandpack-core/lib/transpiler';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class CSSTranspiler extends Transpiler {
  constructor() {
    super('css-loader');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(
      /* webpackChunkName: 'css-loader' */ './loader'
    ).then(loader => loader.default(code, loaderContext));
  }
}

const transpiler = new CSSTranspiler();

export { CSSTranspiler };

export default transpiler;
