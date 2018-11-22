export const JS = {
  id: 'js',
  extension: '.js',
  condition: '.jsx?$',
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

export const MDX = {
  id: 'mdx',
  extension: '.js',
  condition: '.mdx?$',
  code: `
import React from 'react';
import { render } from 'react-dom';

export default async function(module) {
  const node = document.createElement('div');
  document.body.appendChild(node);

  render(React.createElement(module.default, {
    components: {
      a: (props) => {
        if (props.href && props.href.startsWith('./')) {
          return <a {...props} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const api = require('codesandbox-api');

            api.dispatch(api.actions.editor.openModule(props.href.replace('.', '')));
          }}  />;
        }

        return <a target="_blank" rel="noopener noreferrer" {...props} />;
      }
    }
  }), node);
}
`,
};

export const HTML = {
  id: 'html',
  extension: '.html',
  condition: '.html$',
  code: `
export default function(module) {
  document.body.innerHTML = module
}
`,
};

export default [JS, HTML, MDX];
