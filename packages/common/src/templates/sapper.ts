import configurations from './configuration';

import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

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
  'https://sapper.svelte.dev/',
  'github/codesandbox-app/sapper-template',
  decorateSelector(() => '#159497'),
  {
    extraConfigurations: {
      '/sandbox.config.json': extendedSandboxConfig,
    },
    staticDeployment: false,
    mainFile: ['/src/routes/index.html'],
    showOnHomePage: true,
  }
);
