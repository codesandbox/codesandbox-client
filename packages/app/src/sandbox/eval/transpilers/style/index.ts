import { dispatch } from 'codesandbox-api';
import Transpiler from '..';
import { LoaderContext } from '../../transpiled-module';

import insertCss from './utils/insert-css';
import toDefinition from './utils/to-definition';
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
    const { path } = loaderContext;

    if (loaderContext.options.module) {
      return getModules(code, loaderContext).then(({ css, exportTokens }) => {
        let result = insertCss(id, css);
        result += `\nmodule.exports=${JSON.stringify(exportTokens)};`;

        dispatch({
          type: 'add-extra-lib',
          path,
          code: toDefinition(exportTokens),
        });
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
