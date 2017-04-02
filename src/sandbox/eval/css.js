const getStyleId = id => id + '-css'; // eslint-disable-line

function getGeneratedClassNameCode(code: string, alteredClassNames) {
  let newCode = code;
  Object.keys(alteredClassNames).forEach(cn => {
    const regex = new RegExp(`.${cn} `);
    newCode = newCode.replace(regex, `.${alteredClassNames[cn]} `);
  });
  return newCode;
}

function createStyleNode(id: string, content: string) {
  const styleNode = document.getElementById(getStyleId(id)) ||
    document.createElement('style');

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

function getGeneratedClassNames(id: string, classNames: Array<string>) {
  return classNames
    .map(t => t.replace('.', ''))
    .reduce((prev, next) => ({ ...prev, [next]: `cs-${id}-${next}` }), {});
}

/**
 * Adds CSS to HEAD and creates a mapping of classname -> generatedClassname
 */
export default (module, sandboxId) => {
  const css = module.code;

  const classNameRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
  const classNames = css.match(classNameRegex);

  // const alteredClassNames = getGeneratedClassNames(module.id, classNames);

  // const newCode = getGeneratedClassNameCode(module.code, alteredClassNames);
  createStyleNode(`${sandboxId}${module.id}`, css);

  return classNames;
};
