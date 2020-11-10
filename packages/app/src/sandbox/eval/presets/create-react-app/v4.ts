import _debug from '@codesandbox/common/lib/utils/debug';

import { Manager, Preset } from 'sandpack-core';
import { dispatch } from 'codesandbox-api';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svgrTranspiler from '../../transpilers/svgr';
import sassTranspiler from '../../transpilers/sass';
import refreshTranspiler from '../../transpilers/react/refresh-transpiler';
import styleProcessor from '../../transpilers/postcss';
import {
  hasRefresh,
  aliases,
  cleanUsingUnmount,
  isMinimalReactVersion,
} from './utils';

const debug = _debug('cs:compiler:cra');

async function initializeReactDevTools() {
  if (!window.opener) {
    const { initialize: initializeDevTools, activate } = await import(
      /* webpackChunkName: 'react-devtools-backend' */ 'react-devtools-inline/backend'
    );
    // The dispatch needs to happen before initializing, so that the backend can already listen
    dispatch({ type: 'activate-react-devtools' });

    // @ts-ignore
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      try {
        // @ts-ignore We need to make sure that the existing chrome extension doesn't interfere
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      } catch (e) {
        /* ignore */
      }
    }
    // Call this before importing React (or any other packages that might import React).
    initializeDevTools(window);
    activate(window);
  }
}

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
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
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
  let initialized = false;
  let refreshInitialized = false;
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
    ],
    aliases,
    {
      hasDotEnv: true,
      processDependencies: async dependencies => {
        if (
          dependencies['react-dom'] &&
          isMinimalReactVersion(dependencies['react-dom'], '16.9.0')
        ) {
          return { ...dependencies, 'react-refresh': '0.8.1' };
        }

        return dependencies;
      },
      setup: async manager => {
        const dependencies = manager.manifest.dependencies;
        const isRefresh = await hasRefresh(dependencies);

        if (!initialized || refreshInitialized !== isRefresh) {
          initialized = true;
          refreshInitialized = isRefresh;
          preset.resetTranspilers();

          if (isRefresh) {
            debug('Refresh is enabled, registering additional transpiler');
            // Add react refresh babel plugin for non-node_modules

            preset.registerTranspiler(
              module =>
                !module.path.startsWith('/node_modules') &&
                /\.m?(t|j)sx?$/.test(module.path) &&
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
          } else {
            debug('Refresh is disabled');
          }

          preset.registerTranspiler(
            module =>
              /\.m?(t|j)sx?$/.test(module.path) &&
              !module.path.endsWith('.d.ts'),
            [{ transpiler: babelTranspiler, options: BABEL7_CONFIG }]
          );

          preset.registerTranspiler(module => /\.svg$/.test(module.path), [
            { transpiler: svgrTranspiler },
            { transpiler: babelTranspiler, options: BABEL7_CONFIG },
          ]);

          preset.registerTranspiler(
            module => /\.module\.s[c|a]ss$/.test(module.path),
            [
              { transpiler: sassTranspiler },
              { transpiler: styleProcessor },
              {
                transpiler: stylesTranspiler,
                options: { module: true, hmrEnabled: isRefresh },
              },
            ]
          );
          preset.registerTranspiler(
            module => /\.module\.css$/.test(module.path),
            [
              { transpiler: styleProcessor },
              {
                transpiler: stylesTranspiler,
                options: { module: true, hmrEnabled: isRefresh },
              },
            ]
          );

          preset.registerTranspiler(module => /\.css$/.test(module.path), [
            { transpiler: styleProcessor },
            {
              transpiler: stylesTranspiler,
              options: { hmrEnabled: isRefresh },
            },
          ]);
          preset.registerTranspiler(module => /\.s[c|a]ss$/.test(module.path), [
            { transpiler: sassTranspiler },
            { transpiler: styleProcessor },
            {
              transpiler: stylesTranspiler,
              options: { hmrEnabled: isRefresh },
            },
          ]);

          preset.registerTranspiler(module => /\.json$/.test(module.path), [
            { transpiler: jsonTranspiler },
          ]);

          preset.registerTranspiler(() => true, [
            { transpiler: rawTranspiler },
          ]);
        }
      },
      preEvaluate: async manager => {
        if (manager.isFirstLoad) {
          await initializeReactDevTools();
        }

        if (await hasRefresh(manager.manifest.dependencies)) {
          await createRefreshEntry(manager);
        }

        const reactDom = manager.manifest.dependencies.find(
          n => n.name === 'react-dom'
        );
        if (
          reactDom &&
          !manager.webpackHMR &&
          !(await isMinimalReactVersion(reactDom.version, '16.8.0'))
        ) {
          cleanUsingUnmount(manager);
        }
      },
    }
  );

  return preset;
}
