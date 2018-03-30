<<<<<<< HEAD
// @flow
=======
import VueIcon from 'common/components/logos/Vue';

>>>>>>> more fixes
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

class VueTemplate extends Template {
  getEntries(configurationFiles) {
    const entries = super.getEntries(configurationFiles);

    entries.push('/src/main.js');
    entries.push('/main.js');

    return entries;
  }

  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles) {
    return ['/static/index.html', '/index.html'];
  }
}

export default new VueTemplate(
  'vue-cli',
  'Vue',
  'https://github.com/vuejs/vue-cli',
  'vue',
  decorateSelector(() => '#41B883'),
  {
    showOnHomePage: true,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    distDir: 'dist',
  }
);
