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
          // This is incompatible with the official target
          // but sandpack does not even run on ie9 so no point in doing more transforms
          targets: '>1%, not ie 11, not op_mini',
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
      [
        'react',
        {
          runtime: 'automatic',
        },
      ],
      'typescript',
    ],
  },
};

export default function initialize() {
  const preset = reactPreset(BABEL7_CONFIG);

  return preset;
}
