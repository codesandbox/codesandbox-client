// @flow
import configurations from './configuration';

import Template from './template';
import { decorateSelector } from '../theme';

const extendedSandboxConfig = {
  ...configurations.sandboxConfig,
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
};

export default new Template(
  'sapper',
  'Sapper',
  'https://sapper.svelte.technology/',
  'github/codesandbox-app/sapper-template',
  decorateSelector(() => '#105E10'),
  {
    extraConfigurations: {
      '/sandbox.config.json': extendedSandboxConfig,
    },
    isServer: true,
    netlify: false,
    mainFile: ['/src/routes/index.html'],
    showOnHomePage: true,
  }
);
