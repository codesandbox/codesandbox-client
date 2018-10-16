// @flow

import configurations from './configuration';

import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'create-react-app-typescript',
  'React + TS',
  'https://github.com/wmonk/create-react-app-typescript',
  'react-ts',
  decorateSelector(() => '#009fff'),
  {
    isTypescript: true,
    showOnHomePage: true,
    extraConfigurations: {
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
