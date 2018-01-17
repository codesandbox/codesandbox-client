import Preset from '../';

import stylesTranspiler from '../../transpilers/style';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import babelTranspiler from '../../transpilers/babel';

export default function initialize() {
  const preset = new Preset('create-react-app-typescript', [
    'web.ts',
    'ts',
    'json',
    'web.tsx',
    'tsx',
    'js',
  ]);

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
  ]);

  preset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
