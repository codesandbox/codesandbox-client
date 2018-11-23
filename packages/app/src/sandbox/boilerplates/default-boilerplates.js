import mdxCode from 'raw-loader!./mdx-boilerplate';

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

// Yes, we need to do this because of static imports with bundlers...
function importReact(manager) {
  if (manager.manifest.dependencies.react) {
    return Promise.resolve();
  }

  return import('react').then(x => {
    manager.addPreloadedDependency('react', x);
  });
}

function importReactDOM(manager) {
  if (manager.manifest.dependencies['react-dom']) {
    return Promise.resolve();
  }

  return import('react-dom').then(x => {
    manager.addPreloadedDependency('react-dom', x);
  });
}

function importMDX(manager) {
  if (manager.manifest.dependencies['@mdx-js/mdx']) {
    return Promise.resolve();
  }

  return import('@mdx-js/mdx').then(x => {
    manager.addPreloadedDependency('@mdx-js/mdx', x);
  });
}

function importMDXTag(manager) {
  if (manager.manifest.dependencies['@mdx-js/tag']) {
    return Promise.resolve();
  }

  return import('@mdx-js/tag').then(x => {
    manager.addPreloadedDependency('@mdx-js/tag', x);
  });
}

export const MDX = {
  id: 'mdx',
  extension: '.js',
  condition: '.mdx?$',
  prepare: manager =>
    Promise.all([
      importReact(manager),
      importReactDOM(manager),
      importMDX(manager),
      importMDXTag(manager),
    ]),
  code: mdxCode,
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
