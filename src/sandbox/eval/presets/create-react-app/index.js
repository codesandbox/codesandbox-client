import Preset from '../';

import stylesTranspiler from '../../transpilers/css';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';

const preset = new Preset('create-react-app');

preset.registerTranspiler(module => /\.css$/.test(module.title), [
  { transpiler: stylesTranspiler },
]);

preset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  { transpiler: babelTranspiler },
]);

preset.registerTranspiler(module => /\.json$/.test(module.title), [
  { transpiler: jsonTranspiler },
]);

preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default preset;
