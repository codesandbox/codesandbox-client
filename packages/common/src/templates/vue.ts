import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

class VueTemplate extends Template {
  getEntries(configurationFiles: ParsedConfigurationFiles) {
    const entries = super.getEntries(configurationFiles);

    entries.push('/src/main.js');
    entries.push('/main.js');

    return entries;
  }

  getHTMLEntries(): Array<string> {
    return ['/static/index.html', '/public/index.html', '/index.html'];
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
      '/tsconfig.json': configurations.tsconfig,
    },
    distDir: 'dist',
    main: true,
    popular: true,
    mainFile: ['/src/main.js', '/src/main.ts'],
  }
);
