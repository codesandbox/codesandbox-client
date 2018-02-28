// @flow

import ParcelIcon from 'common/components/logos/Parcel';
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
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
