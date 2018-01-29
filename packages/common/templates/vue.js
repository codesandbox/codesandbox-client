// @flow
import VueIcon from 'common/components/logos/Vue';

import Template from './template';
import { decorateSelector } from '../theme';

class VueTemplate extends Template {
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: {
    [type: string]: Object,
  }): Array<string> {
    return ['/static/index.html', '/index.html'];
  }
}

export default new VueTemplate(
  'vue-cli',
  'Vue',
  'https://github.com/vuejs/vue-cli',
  'vue',
  VueIcon,
  decorateSelector(() => '#41B883'),
  { showOnHomePage: true, distDir: 'dist' }
);
