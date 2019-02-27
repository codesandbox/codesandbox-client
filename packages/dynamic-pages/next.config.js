// next.config.js
const withCSS = require('@zeit/next-css');
const withTM = require('next-plugin-transpile-modules');

module.exports = withCSS(
  withTM({
    transpileModules: ['common', 'app'],
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
  })
);
