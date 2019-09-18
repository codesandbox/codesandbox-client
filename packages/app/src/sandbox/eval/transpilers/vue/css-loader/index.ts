import Transpiler from '../..';
import { LoaderContext } from '../../../transpiled-module';

// This is the most advanced compiler, I wanted to get it working in sync first,
// but will eventually move to async.

class CSSTranspiler extends Transpiler {
  constructor() {
    super('css-loader');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    return import(/* webpackChunkName: 'css-loader' */ './loader').then(
      loader => loader.default(code, loaderContext)
    );
  }
}

const transpiler = new CSSTranspiler();

export { CSSTranspiler };

export default transpiler;
