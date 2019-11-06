module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'lodash',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-system-import-transformer',
    'babel-plugin-macros',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
