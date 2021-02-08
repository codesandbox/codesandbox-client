import { reactPreset } from './utils/reactPreset';

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
  const preset = reactPreset(BABEL7_CONFIG);

  return preset;
}
