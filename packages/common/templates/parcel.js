// @flow

import ParcelIcon from 'common/components/logos/Parcel';
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

class ParcelTemplate extends Template {
  getEntries() {
    const entries = [];

    entries.push('/index.html');
    entries.push('/src/index.html');

    return entries;
  }
}

export default new ParcelTemplate(
  'parcel',
  'Vanilla',
  'https://parceljs.org/',
  'vanilla',
  ParcelIcon,
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
