// @flow

import Template from './template';
import configurations from './configuration';
import { decorateSelector } from '../theme';

export default new Template(
  'angular5',
  'Angular 5',
  'https://github.com/angular/angular',
  'angular5',
  decorateSelector(() => '#DB1538'),
  {
    extraConfigurations: {
      '/.angular-cli.json': configurations.angularCli,
    },
    isTypescript: true,
  }
);
