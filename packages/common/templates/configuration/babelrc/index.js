// @flow
import type { ConfigurationFile } from '../types';

const config: ConfigurationFile = {
  title: '.babelrc',
  type: 'babel',
  description: 'Custom configuration for Babel, the transpiler we use.',
  moreInfoUrl: 'https://babeljs.io/docs/usage/babelrc/',

  getDefaultCode: (template: string) => {
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
            // babel preset env starts with latest, then drops rules.
            // We don't have env, so we just support latest
            'latest',
            'stage-2',
          ],
          plugins: [
            'transform-runtime',
            'transform-vue-jsx',
            'transform-decorators-legacy',
          ],
        },
        null,
        2
      );
    }

    return '{}';
  },

  schema:
    'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/babelrc.json',
};

export default config;
