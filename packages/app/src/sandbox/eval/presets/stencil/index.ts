import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import stencilTranspiler from '../../transpilers/stencil';

const babelOptions = {
  isV7: true,
  config: {
    presets: [],
    plugins: ['@babel/plugin-syntax-import-meta'],
    parserOpts: {
      plugins: ['dynamicImport', 'objectRestSpread', 'importMeta'],
    },
  },
};

export default function initialize() {
  const stencilPreset = new Preset(
    'stencil',
    ['js', 'ts', 'jsx', 'tsx', 'mjs'],
    {}
  );

  stencilPreset.registerTranspiler(module => /\.(t|j)sx?$/.test(module.path), [
    { transpiler: stencilTranspiler },
  ]);

  stencilPreset.registerTranspiler(module => /\.(m|c)js$/.test(module.path), [
    { transpiler: stencilTranspiler },
    { transpiler: babelTranspiler, options: babelOptions },
  ]);

  stencilPreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  stencilPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return stencilPreset;
}
