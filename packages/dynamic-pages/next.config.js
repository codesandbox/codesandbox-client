// next.config.js
const withCSS = require('@zeit/next-css');
const withTM = require('next-plugin-transpile-modules');

const dotEnvResult = require('dotenv').config();

const parsedVariables = dotEnvResult.parsed || {};
const dotEnvVariables = {};
// eslint-disable-next-line
for (const key of Object.keys(parsedVariables)) {
  dotEnvVariables[key] = process.env[key];
}

module.exports = withCSS(
  withTM({
    transpileModules: ['common', 'app', 'lodash-es'],
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

      return config;
    },
    env: {
      ...dotEnvVariables,
    },
  })
);
