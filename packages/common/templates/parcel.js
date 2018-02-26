// @flow

import PreactIcon from 'common/components/logos/Preact';
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

export default new Template(
  'parcel',
  'Parcel',
  'https://parceljs.org/',
  'parcel',
  PreactIcon,
  decorateSelector(() => '#dfb07a'),
  {
    showOnHomePage: true,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
