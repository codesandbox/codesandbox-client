import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'razzle',
  'Razzle',
  'https://github.com/jaredpalmer/razzle',
  'github/jaredpalmer/razzle/tree/master/examples/basic',
  decorateSelector(() => '#529CFB'),
  {
    isServer: true,
    distDir: 'build',
    netlify: false,
    mainFile: ['/src/client.js'],
    showOnHomePage: true,
  }
);
