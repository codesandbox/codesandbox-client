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
    distDir: './',
    main: false,
    mainFile: ['/index.html'],
  }
);
