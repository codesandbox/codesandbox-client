import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'remix-starter',
  'Remix',
  'https://remix.run/',
  'https://github.com/remix-run',
  decorateSelector(() => '#ffffff'),
  {
    distDir: 'build',
    showOnHomePage: true,
    main: true,
    popular: true,
    showCube: false,
  }
);
