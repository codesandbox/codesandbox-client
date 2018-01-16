// @flow

// import configurations from './configuration';
import DojoIcon from 'common/components/logos/Dojo';
import Template from './template';
import { decorateSelector } from '../theme';

export class DojoTemplate extends Template {
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: { [type: string]: Object }): Array<string> {
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
  'Dojo 2',
  'https://github.com/dojo/cli-create-app',
  'dojo2',
  DojoIcon,
  decorateSelector(() => '#D3471C'),
  { showOnHomePage: true }
);
