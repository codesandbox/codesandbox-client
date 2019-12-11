import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'apollo',
  'Apollo',
  'https://www.apollographql.com/docs/apollo-server/',
  'apollo-server',
  decorateSelector(() => '#c4198b'),
  {
    netlify: false,
    mainFile: ['/src/index.js'],
    showOnHomePage: true,
  }
);
