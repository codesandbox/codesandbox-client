// @flow

import ReactIcon from 'common/components/logos/React';

import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'create-react-app-typescript',
  'React + TS',
  'https://github.com/wmonk/create-react-app-typescript',
  'react-ts',
  ReactIcon,
  decorateSelector(() => '#009fff'),
  {
    isTypescript: true,
  }
);
