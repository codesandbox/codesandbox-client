import { Preset } from 'sandpack-core';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';
import { aliases, cleanUsingUnmount } from './utils';

export default function initialize() {
  const preset = new Preset(
    'create-react-app',
    ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'ts', 'tsx', 'mjs'],
    aliases,
    {
      hasDotEnv: true,
      preEvaluate: async manager => {
        if (!manager.webpackHMR) {
          cleanUsingUnmount(manager);
        }
      },
    }
  );

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(module => /\.m?jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        config: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [
            'transform-async-to-generator',
            'transform-object-rest-spread',
            'transform-decorators-legacy',
            'transform-class-properties',
            // Polyfills the runtime needed for async/await and generators
            [
              'transform-runtime',
              {
                helpers: false,
                polyfill: false,
                regenerator: true,
              },
            ],
            [
              'transform-regenerator',
              {
                // Async functions are converted to generators by babel-preset-env
                async: false,
              },
            ],
          ],
        },
      },
    },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
