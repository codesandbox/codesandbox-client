import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'marko',
  'Marko',
  'https://markojs.com/',
  'github/nm123github/marko-codesandbox',
  decorateSelector(() => '#f5ac00'),
  {
    isServer: true,
    showOnHomePage: true,
    main: false,
    netlify: false,
  }
);
