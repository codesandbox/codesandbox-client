import { isBabel7 } from 'common/utils/is-babel-7';

import Preset from '../';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import svgrTranspiler from '../../transpilers/svgr';
import sassTranspiler from '../../transpilers/sass';

export default function initialize() {
  let v2Initialized = false;
  const preset = new Preset(
    'create-react-app',
    ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'ts', 'tsx'],
    { 'react-native': 'react-native-web' },
    {
      hasDotEnv: true,
      setup: manager => {
        const configurations = manager.configurations;

        if (
          isBabel7(
            configurations &&
              configurations.package &&
              configurations.package.parsed &&
              configurations.package.parsed.dependencies
          ) &&
          !v2Initialized
        ) {
          const babelOptions = {
            isV7: true,
            config: {
              plugins: [
                'babel-plugin-macros',
                'proposal-class-properties',
                'proposal-object-rest-spread',
                'transform-runtime',
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
            module => /\.(t|j)sx?$/.test(module.path),
            [
              {
                transpiler: babelTranspiler,
                options: babelOptions,
              },
            ],
            true
          );
          preset.registerTranspiler(
            module => /\.svg$/.test(module.path),
            [
              { transpiler: svgrTranspiler },
              {
                transpiler: babelTranspiler,
                options: babelOptions,
              },
            ],
            true
          );
          preset.registerTranspiler(
            module => /\.s[c|a]ss$/.test(module.path),
            [{ transpiler: sassTranspiler }, { transpiler: stylesTranspiler }],
            true
          );
          preset.registerTranspiler(
            module => /\.module\.s[c|a]ss$/.test(module.path),
            [
              { transpiler: sassTranspiler },
              { transpiler: stylesTranspiler, options: { module: true } },
            ],
            true
          );
          preset.registerTranspiler(
            module => /\.module\.css$/.test(module.path),
            [{ transpiler: stylesTranspiler, options: { module: true } }],
            true
          );
          v2Initialized = true;
        }
      },
      preEvaluate: manager => {
        if (!manager.webpackHMR) {
          try {
            const children = document.body.children;
            // Do unmounting for react
            if (
              manager.manifest &&
              manager.manifest.dependencies.find(n => n.name === 'react-dom')
            ) {
              const reactDOMModule = manager.resolveModule('react-dom', '');
              const reactDOM = manager.evaluateModule(reactDOMModule);

              reactDOM.unmountComponentAtNode(document.body);

              for (let i = 0; i < children.length; i += 1) {
                if (children[i].tagName === 'DIV') {
                  reactDOM.unmountComponentAtNode(children[i]);
                }
              }
            }
          } catch (e) {
            /* don't do anything with this error */

            if (process.env.NODE_ENV === 'development') {
              console.error('Problem while cleaning up');
              console.error(e);
            }
          }
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
