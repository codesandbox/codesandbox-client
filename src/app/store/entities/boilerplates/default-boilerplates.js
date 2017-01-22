export const JS = {
  id: 'js',
  condition: '\.js$', // eslint-disable-line
  code: `
import React from 'react';
import { render } from 'react-dom';

export default function(module) {
  const node = document.createElement('div');
  document.body.appendChild(node);

  render(React.createElement(module.default), node);
}
`,
};

export const HTML = {
  id: 'html',
  condition: '\.html$', // eslint-disable-line
  code: `
export default function(module) {
  document.body.innerHTML = module
}
`,
};

export default [JS, HTML];
