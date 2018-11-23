import mdxCode from 'raw-loader!./mdx-boilerplate';

export const JS = {
  id: 'js',
  extension: '.js',
  condition: '.jsx?$',
  prepare: manager => {
    if (manager.manifest.dependencies['@mdx-js/tag']) {
      return Promise.resolve();
    }

    return import('object-inspect').then(x => {
      manager.addPreloadedDependency('object-inspect', x);
    });
  },
  code: `
import React from 'react';
import { render } from 'react-dom';

function isReactComponent(module) {
  try {
    return module({props:{}}).$$typeof.toString() === "Symbol(react.element)";
  } catch(e) {
    return false;
  }
}

function isReactElement(module) {
  try {
    return module.$$typeof.toString() === "Symbol(react.element)";
  } catch(e) {
    return false;
  }
}

export default function(module, container) {
  const node = document.createElement('div');
  container.appendChild(node);

  const [isReactEl, isReactCom] = [isReactElement(module.default || module), isReactComponent(module.default || module)]

  console.log(isReactEl, isReactCom)
  if (isReactEl || isReactCom) {
    console.log(isReactEl ? module.default || module : React.createElement(module.default || module))
    render(isReactEl ? module.default || module : React.createElement(module.default || module), node);
  } else {
    var inspect = require('object-inspect');

    console.log(inspect.default)
    console.log(inspect.default(module.default || module))
    container.innerHTML = JSON.stringify(module.default || module, null, 2);
  }
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
  extension: '.js',
  condition: '.html$',
  code: `
export default function(module, container = document.body) {
  container.innerHTML = module
}
`,
};

export default [JS, HTML, MDX];
