// @flow
import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

import insertCss from './utils/insert-css';

const getStyleId = id => id + '-css'; // eslint-disable-line

class GlobalCSSTranspiler extends Transpiler {
  constructor() {
    super('style-loader');
    this.cacheable = false;
  }

  cleanModule(loaderContext: LoaderContext) {
    const id = getStyleId(loaderContext._module.getId());
    const element = document.getElementById(id);

    if (element != null && element.parentNode != null) {
      element.parentNode.removeChild(element);
    }
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const id = getStyleId(loaderContext._module.getId());
    const result = insertCss(id, code);
    return Promise.resolve({ transpiledCode: result });
  }
}

const transpiler = new GlobalCSSTranspiler();

export { GlobalCSSTranspiler };

export default transpiler;
