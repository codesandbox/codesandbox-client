import { dispatch } from 'codesandbox-api';
import { Transpiler, LoaderContext } from 'sandpack-core';

import insertCss from './utils/insert-css';
import toDefinition from './utils/to-definition';
import getModules from './get-modules';

const getStyleId = (id: string) => id + '-css'; // eslint-disable-line

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
        let result = insertCss(id, css, loaderContext.options.hmrEnabled);
        result += `\nmodule.exports=${JSON.stringify(exportTokens)};`;

        dispatch({
          type: 'add-extra-lib',
          path,
          code: toDefinition(exportTokens),
        });
        return Promise.resolve({ transpiledCode: result });
      });
    }

    const result = insertCss(id, code, loaderContext.options.hmrEnabled);
    return Promise.resolve({ transpiledCode: result });
  }
}

const transpiler = new StyleTranspiler();

export { StyleTranspiler };

export default transpiler;
