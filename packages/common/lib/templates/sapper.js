'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const configuration_1 = require('./configuration');
const template_1 = require('./template');
const theme_1 = require('../theme');
const extendedSandboxConfig = Object.assign(
  {},
  configuration_1.default.sandboxConfig,
  {
    getDefaultCode: () =>
      JSON.stringify(
        {
          container: {
            port: 3000,
          },
        },
        null,
        2
      ),
  }
);
exports.default = new template_1.default(
  'sapper',
  'Sapper',
  'https://sapper.svelte.technology/',
  'github/codesandbox-app/sapper-template',
  theme_1.decorateSelector(() => '#105E10'),
  {
    extraConfigurations: {
      '/sandbox.config.json': extendedSandboxConfig,
    },
    isServer: true,
    mainFile: ['/src/routes/index.html'],
    showOnHomePage: true,
  }
);
