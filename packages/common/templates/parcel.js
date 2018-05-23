// @flow

import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

import { absolute } from 'common/utils/path';

class ParcelTemplate extends Template {
  getEntries(configurationFiles: { [type: string]: Object }) {
    const entries = [];

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
}

export default new ParcelTemplate(
  'parcel',
  'Vanilla',
  'https://parceljs.org/',
  'vanilla',
  decorateSelector(() => '#dfb07a'),
  {
    showOnHomePage: true,
    showCube: false,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
      '/tsconfig.json': configurations.tsconfig,
    },
    externalResourcesEnabled: false,
    distDir: 'dist',
  }
);
