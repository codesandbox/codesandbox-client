import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

class SolidTemplate extends Template {
  getEntries(configurationFiles: ParsedConfigurationFiles) {
    const entries = super.getEntries(configurationFiles);
    entries.push(
      '/src/index.tsx',
      '/src/index.jsx',
      '/src/App.tsx',
      '/src/App.jsx'
    );
    return entries;
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
    mainFile: [
      '/src/index.tsx',
      '/src/index.jsx',
      '/src/App.tsx',
      '/src/App.jsx',
    ],
  }
);
