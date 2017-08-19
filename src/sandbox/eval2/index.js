// @flow

import babelTranspiler from './transpilers/babel';
import typescriptTranspiler from './transpilers/typescript';
import jsonTranspiler from './transpilers/json';
import rawTranspiler from './transpilers/raw';
import globalCSSTranspiler from './transpilers/global-css';

import PresetManager from './presets';

// Create React App loader
// CSS -> PostCSS => CSS Loader
// JS -> Babel Loader
// HTML -> Raw loader
// Images -> URL loader
// Other -> File loader (for us raw loader for now)

const createReactAppPreset = new PresetManager('create-react-app');

createReactAppPreset.registerTranspiler(
  module => /\.jsx?$/.test(module.title),
  babelTranspiler,
);
createReactAppPreset.registerTranspiler(
  module => /\.tsx?$/.test(module.title),
  typescriptTranspiler,
);
createReactAppPreset.registerTranspiler(
  module => /\.json$/.test(module.title),
  jsonTranspiler,
);
createReactAppPreset.registerTranspiler(
  module => /\.css$/.test(module.title),
  globalCSSTranspiler,
);
createReactAppPreset.registerTranspiler(() => true, rawTranspiler);

export default createReactAppPreset;
