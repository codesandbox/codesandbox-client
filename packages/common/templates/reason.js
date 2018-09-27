// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'reason-react',
  'Reason',
  'https://reasonml.github.io/reason-react/en/',
  'reason-react',
  decorateSelector(() => '#CB5747'),
  {
    showOnHomePage: true,
    main: false,
    mainFile: ['/src/Main.re', 'App.re', 'Index.re'],
  }
);
