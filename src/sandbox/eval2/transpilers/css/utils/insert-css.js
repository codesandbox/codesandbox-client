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

export default function(id, css) {
  const element = document.getElementById(id);
  if (element != null && element.parentNode != null) {
    element.parentNode.removeChild(element);
  }

  const result = wrapper(id, css || '');
  return result;
}
