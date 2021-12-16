const wrapper = (id: string, css: string, webpackHMREnabled = false) => `
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

// 去除 insert-css 中的 module.hot.accept()，以解决构建含有样式文件的前端项目时，HMR 功能失效问题
`;

export default function (
  id: string,
  css?: string,
  webpackHMREnabled?: boolean
) {
  const result = wrapper(id, css || '', webpackHMREnabled);
  return result;
}
