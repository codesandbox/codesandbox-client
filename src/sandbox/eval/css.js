import { getModulePath } from '../../app/store/entities/sandboxes/modules/selectors';
const getStyleId = id => id + '-css'; // eslint-disable-line

function createStyleNode(id: string, content: string) {
  const styleNode =
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
/**
 * Adds CSS to HEAD and creates a mapping of classname -> generatedClassname
 */
export default (module, modules, directories) => {
  const css = module.code;

  const classNameRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  const classNames = css.match(classNameRegex);

  // const alteredClassNames = getGeneratedClassNames(module.id, classNames);
  const path = getModulePath(modules, directories, module.id).replace('/', '');
  // const newCode = getGeneratedClassNameCode(module.code, alteredClassNames);
  createStyleNode(
    module.id,
    `${css}
  //# sourceURL=${path}`,
  );

  return classNames;
};
