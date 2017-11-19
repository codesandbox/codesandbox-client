import Preset from '../';

import stylesTranspiler from '../../transpilers/css';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';

const preset = new Preset('create-react-app', [
  'web.js',
  'js',
  'json',
  'web.jsx',
  'jsx',
]);

preset.registerTranspiler(module => /\.css$/.test(module.path), [
  { transpiler: stylesTranspiler },
]);

preset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
  { transpiler: babelTranspiler },
]);

preset.registerTranspiler(module => /\.json$/.test(module.path), [
  { transpiler: jsonTranspiler },
]);

preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default preset;
