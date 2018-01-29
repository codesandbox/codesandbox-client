// @flow
import ReactIcon from 'common/components/logos/React';

import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'create-react-app',
  'React',
  'https://github.com/facebookincubator/create-react-app',
  'new',
  ReactIcon,
  decorateSelector(() => '#6CAEDD'),
  { showOnHomePage: true }
);
