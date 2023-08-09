import { absolute } from '../utils/path';

import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export class ParcelTemplate extends Template {
  getEntries(configurationFiles: ParsedConfigurationFiles) {
    const entries = [];

    if (typeof document !== 'undefined' && document.location.pathname !== '/') {
      // Push the location of the address bar, eg. when someone has a file
      // /2.html open, you actually want to have that as entry point instead
      // of index.html.
      entries.push(document.location.pathname);
    }

    entries.push(
      configurationFiles.package &&
        configurationFiles.package.parsed &&
        configurationFiles.package.parsed.main &&
        absolute(configurationFiles.package.parsed.main)
    );
    entries.push('/index.html');
    entries.push('/src/index.html');

    return entries.filter(Boolean);
  }

  getHTMLEntries(configurationFiles: ParsedConfigurationFiles): string[] {
    const entries = this.getEntries(configurationFiles);
    return entries.filter(e => e.endsWith('.html'));
  }

  /**
   * The file to open by the editor
   */
  getDefaultOpenedFiles(configFiles) {
    let entries = [];

    entries.push('/index.js');
    entries.push('/src/index.js');
    entries.push('/index.ts');
    entries.push('/src/index.ts');
    entries = entries.concat(this.getEntries(configFiles));

    return entries;
  }
}

export default new ParcelTemplate(
  'parcel',
  'Vanilla',
  'https://parceljs.org/',
  'vanilla',
  decorateSelector(() => '#dfb07a'),
  {
    showOnHomePage: true,
    showCube: true,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
      '/tsconfig.json': configurations.tsconfig,
    },
    externalResourcesEnabled: false,
    distDir: 'dist',
    main: true,
    isTypescript: true,
    popular: true,
  }
);
