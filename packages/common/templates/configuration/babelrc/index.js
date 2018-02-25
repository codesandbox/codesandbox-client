// @flow
import type { ConfigurationFile } from '../types';

const JSX_PRAGMA = {
  react: 'React.createElement',
  preact: 'h',
};

const config: ConfigurationFile = {
  title: '.babelrc',
  type: 'babel',
  description: 'Custom configuration for Babel, the transpiler we use.',
  moreInfoUrl: 'https://babeljs.io/docs/usage/babelrc/',

  getDefaultCode: (
    template: string,
    resolveModule: (path: string) => ?{ code: string }
  ) => {
    if (template === 'preact-cli') {
      return JSON.stringify(
        {
          presets: ['latest', 'stage-1'],
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
        null,
        2
      );
    }

    if (template === 'vue-cli') {
      return JSON.stringify(
        {
          presets: [
            [
              'env',
              {
                modules: false,
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
                },
              },
            ],
            'stage-2',
          ],
          plugins: ['transform-vue-jsx', 'transform-runtime'],
          env: {
            test: {
              presets: ['env', 'stage-2'],
              plugins: [
                'transform-vue-jsx',
                'transform-es2015-modules-commonjs',
                'dynamic-import-node',
              ],
            },
          },
        },
        null,
        2
      );
    }

    if (template === 'parcel') {
      const presets = ['env'];
      const plugins = [];

      const packageJSONModule = resolveModule('/package.json');

      if (packageJSONModule) {
        try {
          const parsed = JSON.parse(packageJSONModule.code);

          let pragma = null;
          Object.keys(JSX_PRAGMA).forEach(dep => {
            if (
              (parsed.dependencies && parsed.dependencies[dep]) ||
              (parsed.devDependencies && parsed.devDependencies[dep])
            ) {
              pragma = JSX_PRAGMA[dep];
            }
          });

          if (pragma !== null) {
            plugins.push(['transform-react-jsx', { pragma }]);
          }
        } catch (e) {
          /* do nothing */
        }
      }

      return JSON.stringify({ presets, plugins }, null, 2);
    }

    return JSON.stringify({ presets: [], plugins: [] }, null, 2);
  },

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/babelrc.json',
};

export default config;
