// @flow
import Transpiler from '../';
import TranspiledModule, { type LoaderContext } from '../../transpiled-module';

import insertCss from './utils/insert-css';

const getStyleId = id => id + '-css'; // eslint-disable-line

const wrapper = (id, css) => `
function createStyleNode(id, content) {
  var styleNode =
    document.getElementById(id) || document.createElement('style');

  styleNode.setAttribute('id', id);
  styleNode.type = 'text/css';
  if (styleNode.styleSheet) {
    styleNode.styleSheet.cssText = content;
  } else {
    styleNode.innerHTML = '';
    styleNode.appendChild(document.createTextNode(content));
  }
  document.head.appendChild(styleNode);
}

// var classNameRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
// var classNames = css.match(classNameRegex);

// const alteredClassNames = getGeneratedClassNames(module.id, classNames);
// const newCode = getGeneratedClassNameCode(module.code, alteredClassNames);
createStyleNode(
  "${id}",
  \`${css}\`
);
`;

class GlobalCSSTranspiler extends Transpiler {
  constructor() {
    super();
    this.cacheable = false;
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    const id = getStyleId(loaderContext.path);
    const result = insertCss(id, code);
    return Promise.resolve({ transpiledCode: result });
  }
}

const transpiler = new GlobalCSSTranspiler();

export { GlobalCSSTranspiler };

export default transpiler;
