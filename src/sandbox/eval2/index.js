// @flow
import type { Sandbox, Module } from 'common/types';

import babelTranspiler from './transpilers/babel';
import typescriptTranspiler from './transpilers/typescript';

// Create React App loader
// CSS -> PostCSS => CSS Loader
// JS -> Babel Loader
// HTML -> Raw loader
// Images -> URL loader
// Other -> File loader (for us raw loader for now)
