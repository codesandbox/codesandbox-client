'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const template_1 = require('./template');
const theme_1 = require('../theme');
const configuration_1 = require('./configuration');
exports.default = new template_1.default(
  'next',
  'Next.js',
  'https://nextjs.org/',
  'github/zeit/next.js/tree/master/examples/hello-world',
  theme_1.decorateSelector(() => '#ffffff'),
  {
    extraConfigurations: {
      '/.babelrc': configuration_1.default.babelrc,
    },
    isServer: true,
    mainFile: ['/pages/index.js'],
    backgroundColor: theme_1.decorateSelector(() => '#000000'),
    showOnHomePage: true,
    main: true,
  }
);
