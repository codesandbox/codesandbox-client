// next.config.js
const withCSS = require('@zeit/next-css');
const withTM = require('next-transpile-modules');

const dotEnvResult = require('dotenv').config();

const parsedVariables = dotEnvResult.parsed || {};
const dotEnvVariables = {};
// eslint-disable-next-line
for (const key of Object.keys(parsedVariables)) {
  dotEnvVariables[key] = process.env[key];
}

module.exports = withCSS(
  withTM({
    transpileModules: ['common'],
    webpack(config) {
      // Further custom configuration here
      config.module.rules.unshift({
        test: /\.(svg|png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/static/',
            },
          },
        ],
      });

      config.module.rules.unshift({
        test: /common\/.*\.(js)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/transform-modules-commonjs'],
            },
          },
        ],
      });

      return config;
    },

    env: {
      ...dotEnvVariables,
    },
  })
);
