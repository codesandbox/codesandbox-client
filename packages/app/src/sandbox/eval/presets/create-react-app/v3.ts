import Manager from 'sandbox/eval/manager';
import Preset from '..';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svgrTranspiler from '../../transpilers/svgr';
import sassTranspiler from '../../transpilers/sass';
import refreshTranspiler from '../../transpilers/react/refresh-transpiler';
import {
  hasRefresh,
  aliases,
  cleanUsingUnmount,
  isMinimalReactVersion,
} from './utils';

/**
 * When using React Refresh we need to evaluate some code before 'react-dom' is initialized
 * (https://github.com/facebook/react/issues/16604#issuecomment-528663101) this is the code.
 */
async function createRefreshEntry(manager: Manager) {
  const entryModule = {
    path: '/node_modules/__csb/react-dom-entrypoint.js',
    code: `if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
const runtime = require('react-refresh/runtime');
runtime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => type => type;
}
`,
  };
  manager.addModule(entryModule);

  const tEntryModule = manager.getTranspiledModule(entryModule);
  tEntryModule.setIsEntry(true);

  await tEntryModule
    .transpile(manager)
    .then(() => tEntryModule.evaluate(manager, { force: true }));
}

const BABEL7_CONFIG = {
  isV7: true,
  compileNodeModulesWithEnv: true,
  config: {
    plugins: [
      ['proposal-decorators', { legacy: true }],
      '@babel/plugin-transform-react-jsx-source',
      'transform-flow-strip-types',
      'transform-destructuring',
      'babel-plugin-macros',
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

export default function initialize() {
  const preset = new Preset(
    'create-react-app-v3',
    ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'ts', 'tsx'],
    aliases,
    {
      hasDotEnv: true,
      setup: async manager => {
        preset.resetTranspilers();
        const { configurations } = manager;

        const { dependencies, devDependencies } =
          configurations?.package?.parsed || {};

        const isRefresh = await hasRefresh(dependencies, devDependencies);

        if (isRefresh) {
          // Add react refresh babel plugin for non-node_modules

          preset.registerTranspiler(
            module =>
              !module.path.startsWith('/node_modules') &&
              /\.(t|j)sx?$/.test(module.path) &&
              !module.path.endsWith('.d.ts'),
            [
              {
                transpiler: babelTranspiler,
                options: {
                  ...BABEL7_CONFIG,
                  config: {
                    ...BABEL7_CONFIG.config,
                    plugins: [
                      ...BABEL7_CONFIG.config.plugins,
                      'react-refresh/babel',
                    ],
                  },
                },
              },
              { transpiler: refreshTranspiler },
            ]
          );
        }

        preset.registerTranspiler(
          module =>
            /\.(t|j)sx?$/.test(module.path) && !module.path.endsWith('.d.ts'),
          [{ transpiler: babelTranspiler, options: BABEL7_CONFIG }]
        );

        preset.registerTranspiler(module => /\.svg$/.test(module.path), [
          { transpiler: svgrTranspiler },
          { transpiler: babelTranspiler, options: BABEL7_CONFIG },
        ]);
        preset.registerTranspiler(module => /\.css$/.test(module.path), [
          {
            transpiler: stylesTranspiler,
            options: { hmrEnabled: isRefresh },
          },
        ]);
        preset.registerTranspiler(module => /\.s[c|a]ss$/.test(module.path), [
          { transpiler: sassTranspiler },
          {
            transpiler: stylesTranspiler,
            options: { hmrEnabled: isRefresh },
          },
        ]);
        preset.registerTranspiler(
          module => /\.module\.s[c|a]ss$/.test(module.path),
          [
            { transpiler: sassTranspiler },
            {
              transpiler: stylesTranspiler,
              options: { module: true, hmrEnabled: isRefresh },
            },
          ]
        );
        preset.registerTranspiler(
          module => /\.module\.css$/.test(module.path),
          [
            {
              transpiler: stylesTranspiler,
              options: { module: true, hmrEnabled: isRefresh },
            },
          ]
        );

        preset.registerTranspiler(module => /\.json$/.test(module.path), [
          { transpiler: jsonTranspiler },
        ]);

        preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);
      },
      preEvaluate: async manager => {
        const { dependencies, devDependencies } =
          manager.configurations?.package?.parsed || {};

        if (await hasRefresh(dependencies, devDependencies)) {
          await createRefreshEntry(manager);
        }

        if (
          !manager.webpackHMR &&
          !(await isMinimalReactVersion(
            dependencies,
            devDependencies,
            '16.8.0'
          ))
        ) {
          cleanUsingUnmount(manager);
        }
      },
    }
  );

  return preset;
}
