import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export default new Template(
  'nest',
  'Nest',
  'https://nestjs.com/',
  'github/nestjs/typescript-starter',
  decorateSelector(() => '#ed2945'),
  {
    extraConfigurations: {
      '/tsconfig.json': configurations.tsconfig,
    },
    mainFile: ['/src/main.ts'],
    showOnHomePage: true,
    staticDeployment: false,
  }
);
