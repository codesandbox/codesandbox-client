import { Preset } from 'sandpack-core';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import reasonTranspiler from '../../transpilers/reason';

import reasonRemap from './reason-remap';

export default function initialize() {
  const preset = new Preset(
    'reason',
    ['web.js', 'js', 're', 'json', 'web.jsx', 'jsx'],
    reasonRemap,
    { hasDotEnv: true }
  );

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(module => /\.(m|c)?jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(module => /\.re$/.test(module.path), [
    { transpiler: reasonTranspiler },
    { transpiler: babelTranspiler, options: { simpleRequire: true } },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
