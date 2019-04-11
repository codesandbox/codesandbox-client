import Template from './template';
import { decorateSelector } from '../theme';

 export default new Template(
  'adonis',
  'AdonisJs',
  'https://adonisjs.com/',
  'github/adonisjs/adonis-starter-codesandbox',
  decorateSelector(() => '#fff'),
  {
    isServer: true,
    mainFile: ['/start/routes.js'],
    showOnHomePage: true,
    netlify: false,
  }
);
