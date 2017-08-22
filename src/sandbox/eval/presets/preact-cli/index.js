import babelTranspiler from '../../transpilers/babel';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import noopTranspiler from '../../transpilers/noop';
import binaryTranspiler from '../../transpilers/binary';
import vueTranspiler from '../../transpilers/vue';
import vueTemplateTranspiler from '../../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../../transpilers/vue/style-compiler';
import base64Transpiler from '../../transpilers/base64';

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
  },
);

preactPreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
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

preactPreset.registerTranspiler(module => /\.s[a|c]ss/.test(module.title), [
  { transpiler: sassTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.less/.test(module.title), [
  { transpiler: lessTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(module => /\.styl/.test(module.title), [
  { transpiler: stylusTranspiler },
  { transpiler: stylesTranspiler },
]);

preactPreset.registerTranspiler(
  () => false /* never load without explicit statement */,
  [{ transpiler: asyncTranspiler }],
);

preactPreset.registerTranspiler(() => true, [rawTranspiler]);

export default preactPreset;
