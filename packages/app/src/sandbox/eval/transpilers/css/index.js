// @flow
import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

import insertCss from './utils/insert-css';
import getModules from './get-modules';

const getStyleId = id => id + '-css'; // eslint-disable-line

class StyleTranspiler extends Transpiler {
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

    if (loaderContext.options.module) {
      return getModules(code, loaderContext).then(({ css, exportTokens }) => {
        let result = insertCss(id, css);
        result += `\nexports=${JSON.stringify(exportTokens)};`;

        return Promise.resolve({ transpiledCode: result });
      });
    }

    const result = insertCss(id, code);
    return Promise.resolve({ transpiledCode: result });
  }
}

const transpiler = new StyleTranspiler();

export { StyleTranspiler };

export default transpiler;
