import { Preset } from 'sandpack-core';
import { PackageJSON } from '@codesandbox/common/lib/types';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import prefreshTranspiler from './transpilers/refresh-transpiler';
import { createRefreshEntry } from './utils/createRefreshEntry';

import asyncTranspiler from './transpilers/async';


export default function PreactPreset(pkg: PackageJSON) {
  const hasRefresh = pkg.devDependencies['@prefresh/core'];

  // if(hasRefresh) console.log('prefresh enabled')

  const preactPreset = new Preset(
    'preact-cli',
    ['js', 'jsx', 'ts', 'tsx', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
    {
      preact$: 'preact',
      // preact-compat aliases for supporting React dependencies:
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'create-react-class': 'preact/compat/lib/create-react-class',
      'react-addons-css-transition-group': 'preact-css-transition-group',
    },
    {
      processDependencies: async originalDeps => {
        const deps = { ...originalDeps };

        if (!deps['@babel/runtime']) {
          deps['@babel/runtime'] = '^7.3.4';
        }

        deps['@prefresh/utils'] = '1.2.0';
        deps['@prefresh/core'] = '1.5.2';

        return deps;
      },
      preEvaluate: async manager => {
        if (hasRefresh) {
          await createRefreshEntry(manager);
        }
      },
    }
  );

  preactPreset.registerTranspiler(
    module => /\.(m|c)?(t|j)sx?$/.test(module.path),
    [
      {
        transpiler: babelTranspiler,
        options: {
          isV7: true,
          compileNodeModulesWithEnv: true,
          // config is derived from babelrc at packages/common/src/templates/configuration/babelrc/index.ts
        },
      },
      hasRefresh
        ? {
            transpiler: prefreshTranspiler,
            options: {},
          }
        : null,
    ].filter(Boolean)
  );

  // For these routes we need to enable css modules
  const cssModulesPaths = [
    '/src/components',
    '/components',
    '/src/routes',
    '/routes',
  ];

  const cssModulesRegex = extension =>
    new RegExp(`^(${cssModulesPaths.join('|')})\\/.*\\.${extension}$`);

  const cssTypes = {
    css: [],
    's[a|c]ss': [{ transpiler: sassTranspiler }],
    less: [{ transpiler: lessTranspiler }],
    styl: [{ transpiler: stylusTranspiler }],
  };

  Object.keys(cssTypes).forEach(cssType => {
    preactPreset.registerTranspiler(
      module => cssModulesRegex(cssType).test(module.path),
      [
        ...cssTypes[cssType],
        { transpiler: stylesTranspiler, options: { module: true } },
      ]
    );

    preactPreset.registerTranspiler(
      module => new RegExp(`\\.${cssType}$`).test(module.path),
      [...cssTypes[cssType], { transpiler: stylesTranspiler }]
    );
  });

  preactPreset.registerTranspiler(module => /\.json/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  // Support for !async statements
  preactPreset.registerTranspiler(
    () => false /* never load without explicit statement */,
    [{ transpiler: asyncTranspiler }]
  );

  preactPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preactPreset;
}
