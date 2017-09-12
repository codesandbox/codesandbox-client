import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svelteTranspiler from '../../transpilers/svelte';

import Preset from '../';

const sveltePreset = new Preset('svelte', ['js', 'jsx'], {});

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

sveltePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default sveltePreset;
