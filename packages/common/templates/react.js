// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'create-react-app',
  'React',
  'https://github.com/facebookincubator/create-react-app',
  'new',
  decorateSelector(() => '#61DAFB'),
  { showOnHomePage: true, main: true }
);
