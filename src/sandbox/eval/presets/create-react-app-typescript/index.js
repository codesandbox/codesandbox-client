import Preset from '../';

import stylesTranspiler from '../../transpilers/css';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';

const preset = new Preset('create-react-app-typescript', [
  'web.ts',
  'ts',
  'json',
  'web.tsx',
  'tsx',
]);

preset.registerTranspiler(module => /\.css$/.test(module.path), [
  { transpiler: stylesTranspiler },
]);

preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
  { transpiler: typescriptTranspiler },
]);

preset.registerTranspiler(module => /\.json$/.test(module.path), [
  { transpiler: jsonTranspiler },
]);

preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default preset;
