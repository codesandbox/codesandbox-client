// @flow

import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export class DojoTemplate extends Template {
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: {
    [type: string]: Object,
  }): Array<string> {
    return ['/src/index.html'];
  }

  getEntries(configurationFiles: { [type: string]: Object }) {
    const entries = super.getEntries(configurationFiles);
    entries.push('/src/main.ts');
    return entries;
  }
}

export default new DojoTemplate(
  '@dojo/cli-create-app',
  'Dojo',
  'https://github.com/dojo/cli-create-app',
  'github/dojo/dojo-codesandbox-template',
  decorateSelector(() => '#D3471C'),
  {
    showOnHomePage: true,
    showCube: false,
    isTypescript: true,
    extraConfigurations: {
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
