import { Preset } from 'sandpack-core';
import _debug from '@codesandbox/common/lib/utils/debug';
import { PackageJSON } from '@codesandbox/common/lib/types';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import sassTranspiler from '../../transpilers/sass';
import refreshTranspiler from '../../transpilers/react-refresh/refresh-transpiler';
import lessTranspiler from '../../transpilers/less';
import postcssTranspiler from '../../transpilers/postcss';
import svgrTranspiler from '../../transpilers/svgr';
import reactSvgTranspiler from '../../transpilers/react-svg';
import rawTranspiler from '../../transpilers/raw';
import {
  hasRefresh,
  aliases,
  isMinimalReactDomVersion,
  supportsNewReactTransform,
} from './utils';
import { initializeReactDevToolsLegacy } from './utils/initLegacyDevTools';
import { initializeReactDevToolsLatest } from './utils/initLatestDevTools';
import { createRefreshEntry } from './utils/createRefreshEntry';
import base64Transpiler from '../../transpilers/base64';

export const BASE_REACT_BABEL_PLUGINS = [
  'transform-flow-strip-types',
  ['proposal-decorators', { legacy: true }],
  ['proposal-class-properties', { loose: true }],
  '@babel/plugin-transform-react-jsx-source',
  'babel-plugin-macros',
  [
    'transform-runtime',
    {
      corejs: false,
      helpers: true,
      regenerator: true,
    },
  ],
  'syntax-dynamic-import',
];

export const BASE_REACT_PRESETS_CONFIG = [
  [
    'env',
    {
      // This is incompatible with the official target
      // but sandpack does not even run on ie9 so no point in doing more transforms
      targets: '>1%, not ie 11',
      // Users cannot override this behavior because this Babel
      // configuration is highly tuned for ES5 support
      ignoreBrowserslistConfig: true,
      // If users import all core-js they're probably not concerned with
      // bundle size. We shouldn't rely on magic to try and shrink it.
      useBuiltIns: false,
      // Do not transform modules to CJS
      modules: false,
      // Enable loose transforms, these are enabled for proposal-class-properties
      loose: true,
    },
  ],
  'typescript',
];

const CLASSIC_REACT_BABEL_CONFIG = {
  plugins: [...BASE_REACT_BABEL_PLUGINS],
  presets: [
    ...BASE_REACT_PRESETS_CONFIG,
    [
      'react',
      {
        runtime: 'classic',
      },
    ],
  ],
};

const NEW_REACT_BABEL_CONFIG = {
  plugins: [...BASE_REACT_BABEL_PLUGINS],
  presets: [
    ...BASE_REACT_PRESETS_CONFIG,
    [
      'react',
      {
        runtime: 'automatic',
      },
    ],
  ],
};

export async function reactPreset(pkg: PackageJSON) {
  const debug = _debug('cs:compiler:cra');
  let initialized = false;
  let refreshInitialized = false;

  const newReactTransform = await supportsNewReactTransform(
    pkg.dependencies,
    pkg.devDependencies
  );

  const babelConfig = newReactTransform
    ? NEW_REACT_BABEL_CONFIG
    : CLASSIC_REACT_BABEL_CONFIG;

  const preset = new Preset(
    'create-react-app',
    [
      'web.mjs',
      'mjs',
      'web.js',
      'js',
      'web.ts',
      'ts',
      'web.tsx',
      'tsx',
      'json',
      'web.jsx',
      'jsx',
      'web.cjs',
      'cjs',
    ],
    aliases,
    {
      hasDotEnv: true,
      processDependencies: async originalDeps => {
        const deps = { ...originalDeps };
        if (
          deps['react-dom'] &&
          isMinimalReactDomVersion(deps['react-dom'], '16.9.0')
        ) {
          deps['react-refresh'] = '0.9.0';
        }

        if (!deps['@babel/core']) {
          deps['@babel/core'] = '^7.3.3';
        }

        if (!deps['@babel/runtime']) {
          deps['@babel/runtime'] = '^7.3.4';
        }

        // Don't delete babel-runtime, some dependencies rely on it...
        // delete deps['babel-runtime'];
        delete deps['babel-core'];

        return deps;
      },
      setup: async manager => {
        const dependencies = manager.manifest.dependencies;
        const isRefresh = await hasRefresh(dependencies);

        if (!initialized || refreshInitialized !== isRefresh) {
          initialized = true;
          refreshInitialized = isRefresh;
          preset.resetTranspilers();

          preset.registerTranspiler(
            module => /^https?:\/\/.*/.test(module.path),
            [{ transpiler: babelTranspiler, options: {} }]
          );

          if (isRefresh) {
            debug('Refresh is enabled, registering additional transpiler');
            // Add react refresh babel plugin for non-node_modules

            preset.registerTranspiler(
              module =>
                /^(?!\/node_modules\/).*\.(((m|c)?jsx?)|tsx)$/.test(
                  module.path
                ),
              [
                {
                  transpiler: babelTranspiler,
                  options: {
                    isV7: true,
                    config: {
                      ...babelConfig,
                      plugins: [
                        ...babelConfig.plugins,
                        ['react-refresh/babel', { skipEnvCheck: true }],
                      ],
                    },
                  },
                },
                { transpiler: refreshTranspiler },
              ]
            );
          } else {
            debug('Refresh is disabled');
          }

          preset.registerTranspiler(
            module => {
              return (
                /\.(m|c)?(t|j)sx?$/.test(module.path) &&
                !module.path.endsWith('.d.ts')
              );
            },
            [
              {
                transpiler: babelTranspiler,
                options: {
                  isV7: true,
                  compileNodeModulesWithEnv: true,
                  config: babelConfig,
                },
              },
            ]
          );

          // svgr is required for the react-svg-transpiler
          preset.addTranspiler(svgrTranspiler);
          preset.registerTranspiler(module => /\.svg$/.test(module.path), [
            { transpiler: reactSvgTranspiler },
            { transpiler: babelTranspiler },
          ]);

          preset.registerTranspiler(module => /\.less$/.test(module.path), [
            { transpiler: lessTranspiler },
            { transpiler: postcssTranspiler },
            {
              transpiler: stylesTranspiler,
              options: { hmrEnabled: true },
            },
          ]);

          preset.registerTranspiler(
            module => /\.module\.s[c|a]ss$/.test(module.path),
            [
              { transpiler: sassTranspiler },
              { transpiler: postcssTranspiler },
              {
                transpiler: stylesTranspiler,
                options: { module: true, hmrEnabled: isRefresh },
              },
            ]
          );
          preset.registerTranspiler(
            module => /\.module\.css$/.test(module.path),
            [
              { transpiler: postcssTranspiler },
              {
                transpiler: stylesTranspiler,
                options: { module: true, hmrEnabled: isRefresh },
              },
            ]
          );

          preset.registerTranspiler(module => /\.css$/.test(module.path), [
            { transpiler: postcssTranspiler },
            {
              transpiler: stylesTranspiler,
              options: { hmrEnabled: isRefresh },
            },
          ]);
          preset.registerTranspiler(module => /\.s[c|a]ss$/.test(module.path), [
            { transpiler: sassTranspiler },
            { transpiler: postcssTranspiler },
            {
              transpiler: stylesTranspiler,
              options: { hmrEnabled: isRefresh },
            },
          ]);

          preset.registerTranspiler(module => /\.json$/.test(module.path), [
            { transpiler: jsonTranspiler },
          ]);

          preset.registerTranspiler(module => /\.html$/.test(module.path), [
            { transpiler: rawTranspiler },
          ]);

          preset.registerTranspiler(() => true, [
            { transpiler: base64Transpiler },
          ]);

          // Try to preload jsx-runtime
          manager
            .resolveTranspiledModuleAsync('react/jsx-runtime')
            .then(x => {
              x.transpile(manager);
            })
            .catch(() => {
              /* Ignore */
            });
        }
      },
      preEvaluate: async manager => {
        if (manager.isFirstLoad && manager.reactDevTools) {
          if (manager.reactDevTools === 'latest') {
            await initializeReactDevToolsLatest();
          } else if (manager.reactDevTools === 'legacy') {
            await initializeReactDevToolsLegacy();
          }
        }

        if (await hasRefresh(manager.manifest.dependencies)) {
          await createRefreshEntry(manager);
        }
      },
    }
  );

  return preset;
}
