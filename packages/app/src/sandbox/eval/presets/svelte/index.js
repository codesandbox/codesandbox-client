import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svelteTranspiler from '../../transpilers/svelte';

import Preset from '../';

const sveltePreset = new Preset('svelte', ['js', 'jsx'], {});

sveltePreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
  { transpiler: babelTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.html$/.test(module.path), [
  { transpiler: svelteTranspiler },
  { transpiler: babelTranspiler },
]);

sveltePreset.registerTranspiler(module => /\.json/.test(module.path), [
  { transpiler: jsonTranspiler },
]);

sveltePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default sveltePreset;
