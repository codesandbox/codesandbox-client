import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

class SolidTemplate extends Template {
  getEntries(configurationFiles: ParsedConfigurationFiles) {
    return super.getEntries(configurationFiles);
  }

  getHTMLEntries(): Array<string> {
    return ['/static/index.html', '/public/index.html', '/index.html'];
  }
}

export default new SolidTemplate(
  'solid',
  'Solid JS',
  'https://github.com/solidjs/solid',
  'solid',
  decorateSelector(() => '#2596be'),
  {
    showOnHomePage: false,
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
