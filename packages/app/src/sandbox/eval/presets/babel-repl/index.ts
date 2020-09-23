import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';

export default function initialize() {
  const babelPreset = new Preset(
    'babel-repl',
    ['js', 'jsx', 'ts', 'tsx', 'json'],
    {},
    {}
  );

  babelPreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        disableCodeSandboxPlugins: true,
      },
    },
  ]);

  babelPreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  babelPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return babelPreset;
}
