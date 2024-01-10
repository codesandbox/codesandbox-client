import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'adonis',
  'AdonisJs',
  'https://adonisjs.com/',
  'github/adonisjs/adonis-starter-codesandbox',
  decorateSelector(() => '#fff'),
  {
    mainFile: ['/start/routes.js'],
    showOnHomePage: true,
    staticDeployment: false,
  }
);
