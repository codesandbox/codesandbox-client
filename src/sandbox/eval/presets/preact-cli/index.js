import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';

import asyncTranspiler from './transpilers/async';

import Preset from '../';

const preactPreset = new Preset(
  'preact-cli',
  ['js', 'jsx', 'ts', 'tsx', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
  {
    preact$: 'preact',
    // preact-compat aliases for supporting React dependencies:
    react: 'preact-compat',
    'react-dom': 'preact-compat',
    'create-react-class': 'preact-compat/lib/create-react-class',
    'react-addons-css-transition-group': 'preact-css-transition-group',
  }
);

preactPreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
  {
    transpiler: babelTranspiler,
    options: {
      presets: [
        // babel preset env starts with latest, then drops rules.
        // We don't have env, so we just support latest
        'latest',
        'stage-1',
      ],
      plugins: [
        'transform-object-assign',
        'transform-decorators-legacy',
        ['transform-react-jsx', { pragma: 'h' }],
        [
          'jsx-pragmatic',
          {
            module: 'preact',
            export: 'h',
            import: 'h',
          },
        ],
      ],
    },
  },
]);

preactPreset.registerTranspiler(module => /\.s[a|c]ss/.test(module.path), [
  { transpiler: sassTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.less/.test(module.path), [
  { transpiler: lessTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.json/.test(module.path), [
  { transpiler: jsonTranspiler },
]);

preactPreset.registerTranspiler(module => /\.styl/.test(module.path), [
  { transpiler: stylusTranspiler },
  { transpiler: stylesTranspiler },
]);

// Support for !async statements
preactPreset.registerTranspiler(
  () => false /* never load without explicit statement */,
  [{ transpiler: asyncTranspiler }]
);

preactPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default preactPreset;
