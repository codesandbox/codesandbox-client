// @flow

import Template from './template';
import { decorateSelector } from '../theme';

export class EmberTemplate extends Template {
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

  export default new EmberTemplate(
  'ember',
  'ember-cli',
  'https://www.emberjs.com',
  'github/emberjs/ember-codesandbox-template',
  decorateSelector(() => '#E04E39'),
  {
    showOnHomePage: true,
    showCube: false,
    isTypescript: true,
  }
  );
