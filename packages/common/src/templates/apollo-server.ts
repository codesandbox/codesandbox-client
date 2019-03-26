// @flow
import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'apollo',
  'Apollo',
  'https://www.apollographql.com/docs/apollo-server/',
  'apollo-server',
  decorateSelector(() => '#c4198b'),
  {
    isServer: true,
    netlify: false,
    mainFile: ['/src/index.js'],
    showOnHomePage: true,
  }
);
