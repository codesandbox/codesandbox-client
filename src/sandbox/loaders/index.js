// @flow
import type { Sandbox, Module } from 'common/types';
import codesandbox from 'codesandbox';

import { compose } from 'lodash';

const javascriptLoader = compose(localResolver, transpiler, evaller);

const createReactApp = {
  loaders: [
    {
      test: (path: string) => /^(\w|@)/.test(path),
      loader: dependencyLoader,
    },
    {
      test: (path: string) => /\.js$/.test(path),
      loader: compose(javascriptLoader, fileResolver),
    },
    {
      test: (path: string) => /\.css$/.test(path),
      loader: compose(cssLoader, fileResolver),
    },
    {
      test: (path: string) => /\.scss$/.test(path),
      loader: compose(sassTranspiler, cssLoader, fileResolver),
    },
  ],
};

export default function loadModule(sandbox: Sandbox, module: Module) {
  codesandbox.loadLoader('javascript');
}

// Create React App loader
// CSS -> PostCSS => CSS Loader
// JS -> Babel Loader
// HTML -> Raw loader
// Images -> URL loader
// Other -> File loader (for us raw loader for now)

const createReactApp = {
  loader: (module: Module) => {},
};
