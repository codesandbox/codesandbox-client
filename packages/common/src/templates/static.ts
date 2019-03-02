// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'static',
  'Static',
  'https://developer.mozilla.org/en-US/docs/Learn/HTML',
  'github/codesandbox-app/static-template',
  decorateSelector(() => '#3AA855'),
  {
    showOnHomePage: true,
    main: false,
    mainFile: ['/index.html'],
  }
);
