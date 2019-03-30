import Template from './template';
import { decorateSelector } from '../theme';

export default new Template(
  'mdx-deck',
  'MDX Deck',
  'https://github.com/jxnblk/mdx-deck',
  'github/jxnblk/mdx-deck/tree/master/templates/basic',
  decorateSelector(() => '#FAD961'),
  {
    distDir: 'dist',
    isServer: true,
    mainFile: ['deck.mdx'],
    showOnHomePage: true,
  }
);
