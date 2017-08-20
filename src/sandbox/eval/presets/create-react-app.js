import Preset from './';

import globalCSSTranspiler from '../transpilers/css/global';
import babelTranspiler from '../transpilers/babel';
import jsonTranspiler from '../transpilers/json';
import rawTranspiler from '../transpilers/raw';

const preset = new Preset('create-react-app');

preset.registerTranspiler(module => /\.css$/.test(module.title), [
  globalCSSTranspiler,
]);

preset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  babelTranspiler,
]);

preset.registerTranspiler(module => /\.json$/.test(module.title), [
  jsonTranspiler,
]);

preset.registerTranspiler(() => true, [rawTranspiler]);

export default preset;
