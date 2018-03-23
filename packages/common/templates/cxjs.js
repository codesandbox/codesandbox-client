// @flow

import CxJSIcon from 'common/components/logos/CxJS';
import Template from './template';
import { decorateSelector } from '../theme';
import configurations from './configuration';

class CxJSTemplate extends Template {
  getEntries() {
    const entries = [];

    entries.push('/src/index.js');
    entries.push('/app/index.js');

    return entries;
  }
}

export default new CxJSTemplate(
  'cxjs',
  'CxJS',
  'https://cxjs.io/',
  'cxjs',
  CxJSIcon,
  decorateSelector(() => '#11689f'),
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
