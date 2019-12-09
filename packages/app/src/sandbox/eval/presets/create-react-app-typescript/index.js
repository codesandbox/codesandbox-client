import Preset from '..';

import stylesTranspiler from '../../transpilers/style';
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

  const babelOptions = {
    isV7: true,
    compileNodeModulesWithEnv: true,
    config: {
      plugins: [
        'transform-flow-strip-types',
        'transform-destructuring',
        'babel-plugin-macros',
        ['proposal-decorators', { legacy: true }],
        ['proposal-class-properties', { loose: true }],
        ['proposal-object-rest-spread', { useBuiltIns: true }],
        [
          'transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: true,
          },
        ],
        'syntax-dynamic-import',
      ],
      presets: [
        [
          'env',
          {
            // We want Create React App to be IE 9 compatible until React itself
            // no longer works with IE 9
            targets: {
              ie: 9,
            },
            // Users cannot override this behavior because this Babel
            // configuration is highly tuned for ES5 support
            ignoreBrowserslistConfig: true,
            // If users import all core-js they're probably not concerned with
            // bundle size. We shouldn't rely on magic to try and shrink it.
            useBuiltIns: false,
            // Do not transform modules to CJS
            modules: false,
          },
        ],
        'react',
        'typescript',
      ],
    },
  };
  preset.registerTranspiler(
    module => /\.(t|j)sx?$/.test(module.path) && !module.path.endsWith('.d.ts'),
    [
      {
        transpiler: babelTranspiler,
        options: babelOptions,
      },
    ],
    true
  );

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
