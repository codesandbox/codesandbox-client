module.exports = {
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-flow',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-async-to-generator',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        'babel-plugin-lodash',
        'babel-plugin-macros',
        'babel-plugin-styled-components',
        '@babel/plugin-transform-react-display-name',
      ],
    },
  },
};
