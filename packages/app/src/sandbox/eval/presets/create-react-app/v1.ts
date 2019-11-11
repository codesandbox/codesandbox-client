import Preset from '..';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import { aliases, cleanUsingUnmount } from './utils';

export default function initialize() {
  const preset = new Preset(
    'create-react-app',
    ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'ts', 'tsx'],
    aliases,
    {
      hasDotEnv: true,
      preEvaluate: async manager => {
        if (!manager.webpackHMR) {
          cleanUsingUnmount(manager);
        }
      },
    }
  );

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
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
