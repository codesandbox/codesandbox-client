import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import rawTranspiler from '../../transpilers/raw';
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

sveltePreset.registerTranspiler(module => /\.json/.test(module.title), [
  { transpiler: jsonTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.css/.test(module.title), [
  { transpiler: stylesTranspiler },
]);

sveltePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default sveltePreset;
