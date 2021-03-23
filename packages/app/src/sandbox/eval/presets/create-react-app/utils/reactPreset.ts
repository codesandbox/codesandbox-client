import { Preset } from 'sandpack-core';
import _debug from '@codesandbox/common/lib/utils/debug';
import stylesTranspiler from '../../../transpilers/style';
import babelTranspiler from '../../../transpilers/babel';
import jsonTranspiler from '../../../transpilers/json';
import rawTranspiler from '../../../transpilers/raw';
import svgrTranspiler from '../../../transpilers/svgr';
import sassTranspiler from '../../../transpilers/sass';
import refreshTranspiler from '../../../transpilers/react/refresh-transpiler';
import styleProcessor from '../../../transpilers/postcss';
import {
  hasRefresh,
  aliases,
  cleanUsingUnmount,
  isMinimalReactDomVersion,
} from '../utils';
import { initializeReactDevTools } from './initDevTools';
import { createRefreshEntry } from './createRefreshEntry';

export const reactPreset = babelConfig => {
  const debug = _debug('cs:compiler:cra');
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
          isMinimalReactDomVersion(dependencies['react-dom'], '16.9.0')
        ) {
          return { ...dependencies, 'react-refresh': '0.9.0' };
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
                    ...babelConfig,
                    config: {
                      ...babelConfig.config,
                      plugins: [
                        ...babelConfig.config.plugins,
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
            [{ transpiler: babelTranspiler, options: babelConfig }]
          );

          preset.registerTranspiler(module => /\.svg$/.test(module.path), [
            { transpiler: svgrTranspiler },
            { transpiler: babelTranspiler, options: babelConfig },
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
        if (manager.isFirstLoad && !process.env.SANDPACK) {
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
          !(await isMinimalReactDomVersion(reactDom.version, '16.8.0'))
        ) {
          cleanUsingUnmount(manager);
        }
      },
    }
  );

  return preset;
};
