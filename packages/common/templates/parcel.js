// @flow
import { absolute } from 'common/utils/path';

import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

class ParcelTemplate extends Template {
  getEntries(configurationFiles: { [type: string]: Object }) {
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

  /**
   * The file to open by the editor
   */
  getDefaultOpenedFiles(configFiles) {
    const entries = [];

    entries.push('/index.js');
    entries.push('/src/index.js');
    entries.concat(this.getEntries(configFiles));

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
  }
);
