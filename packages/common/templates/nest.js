// @flow
import Template from './template';
import { decorateSelector } from '../theme';
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
    isServer: true,
    mainFile: ['/src/main.ts'],
    showOnHomePage: false,
  }
);
