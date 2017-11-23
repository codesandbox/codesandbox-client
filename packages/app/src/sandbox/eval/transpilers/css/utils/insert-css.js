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

createStyleNode(
  ${JSON.stringify(id)},
  ${JSON.stringify(css)}
);
`;

export default function(id, css) {
  const result = wrapper(id, css || '');
  return result;
}
