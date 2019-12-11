import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svelteTranspiler from '../../transpilers/svelte';

import Preset from '..';

const babelOptions = {
  isV7: true,
  config: {
    presets: [],
    plugins: [],
    parserOpts: {
      plugins: ['dynamicImport', 'objectRestSpread'],
    },
  },
};

export default function initialize() {
  const sveltePreset = new Preset('svelte', ['js', 'jsx', 'svelte'], {});

  sveltePreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    { transpiler: babelTranspiler, options: babelOptions },
  ]);

  sveltePreset.registerTranspiler(module => /\.svelte$/.test(module.path), [
    { transpiler: svelteTranspiler },
    { transpiler: babelTranspiler, options: babelOptions },
  ]);

  sveltePreset.registerTranspiler(module => /\.html$/.test(module.path), [
    { transpiler: svelteTranspiler },
    { transpiler: babelTranspiler, options: babelOptions },
  ]);

  sveltePreset.registerTranspiler(module => /\.json/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  sveltePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return sveltePreset;
}
