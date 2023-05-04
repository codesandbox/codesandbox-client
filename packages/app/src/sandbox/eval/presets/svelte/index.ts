import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svelteTranspiler from '../../transpilers/svelte';
import sassTranspiler from '../../transpilers/sass';
import styleProcessor from '../../transpilers/postcss';
import stylesTranspiler from '../../transpilers/style';

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
  const sveltePreset = new Preset(
    'svelte',
    ['js', 'cjs', 'mjs', 'jsx', 'svelte'],
    {}
  );

  sveltePreset.registerTranspiler(module => /\.(m|c)?jsx?$/.test(module.path), [
    { transpiler: babelTranspiler, options: babelOptions },
  ]);

  sveltePreset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: styleProcessor },
    {
      transpiler: stylesTranspiler,
      options: { hmrEnabled: false },
    },
  ]);

  sveltePreset.registerTranspiler(module => /\.s[c|a]ss$/.test(module.path), [
    { transpiler: sassTranspiler },
    { transpiler: styleProcessor },
    {
      transpiler: stylesTranspiler,
      options: { hmrEnabled: false },
    },
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
