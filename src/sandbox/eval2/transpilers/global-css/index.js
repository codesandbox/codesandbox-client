// @flow
import Transpiler from '../';
import TranspiledModule, { type LoaderContext } from '../../TranspiledModule';

const wrapper = (id, css) => `
const getStyleId = id => id + '-css'; // eslint-disable-line

function createStyleNode(id, content) {
  var styleNode =
    document.getElementById(getStyleId(id)) || document.createElement('style');

  styleNode.setAttribute('id', getStyleId(id));
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
  doTranspilation(module: TranspiledModule, loaderContext: LoaderContext) {
    const result = wrapper(module.module.id, module.module.code || '');
    return Promise.resolve({
      transpiledCode: result,
    });
  }
}

const transpiler = new GlobalCSSTranspiler();

export { GlobalCSSTranspiler };

export default transpiler;
