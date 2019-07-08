import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'unibit',
  'Unibit',
  'https://www.stackbit.com',
  'github/smnh/universal/tree/master/',
  decorateSelector(() => '#3EB0FD'),
  {
    distDir: 'public',
    isServer: true,
    popular: true,
    mainFile: ['README.md'],
    showOnHomePage: true,
    main: false,
    showCube: false,
  }
);
