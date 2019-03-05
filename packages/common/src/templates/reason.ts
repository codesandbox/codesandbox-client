// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'reason',
  'Reason',
  'https://reasonml.github.io/reason-react/en/',
  'reason',
  decorateSelector(() => '#CB5747'),
  {
    showOnHomePage: true,
    main: false,
    netlify: false,
    mainFile: ['/src/Main.re', 'App.re', 'Index.re'],
  }
);
