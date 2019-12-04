import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'unibit',
  'Unibit',
  'https://www.stackbit.com',
  'github/stackbithq/stackbit-theme-universal/tree/master/',
  decorateSelector(() => '#3EB0FD'),
  {
    distDir: 'public',
    popular: true,
    mainFile: ['README.md'],
    showOnHomePage: true,
    main: false,
    showCube: false,
  }
);
