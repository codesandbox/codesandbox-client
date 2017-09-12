import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import svelteTranspiler from '../../transpilers/svelte';

import Preset from '../';

const sveltePreset = new Preset(
  'svelte',
  ['js', 'jsx', 'html', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
  {}
);

sveltePreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  { transpiler: babelTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.html$/.test(module.title), [
  { transpiler: svelteTranspiler },
  { transpiler: babelTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.s[a|c]ss/.test(module.title), [
  { transpiler: sassTranspiler },
  { transpiler: stylesTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.less/.test(module.title), [
  { transpiler: lessTranspiler },
  { transpiler: stylesTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.json/.test(module.title), [
  { transpiler: jsonTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.styl/.test(module.title), [
  { transpiler: stylusTranspiler },
  { transpiler: stylesTranspiler },
]);

sveltePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default sveltePreset;
