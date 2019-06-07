// next.config.js
const withCSS = require('@zeit/next-css');
const withTM = require('next-transpile-modules');
const env = require('@codesandbox/common/lib/config/env');

const dotEnvResult = require('dotenv').config();

const parsedVariables = dotEnvResult.parsed || {};
const dotEnvVariables = {};
// eslint-disable-next-line
for (const key of Object.keys(parsedVariables)) {
  dotEnvVariables[key] = process.env[key];
}
// eslint-disable-next-line
for (const key of Object.keys(env)) {
  dotEnvVariables[key] = env[key];
}

module.exports = withCSS(
  {
    // withTM({
    //   transpileModules: ['common'],
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

      // config.module.rules.unshift({
      //   test: /common\/.*\.(js)$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         plugins: ['@babel/transform-modules-commonjs'],
      //       },
      //     },
      //   ],
      // });

      return config;
    },

    env: {
      ...dotEnvVariables,
    },

    target: 'serverless',
  }
  // })
);
