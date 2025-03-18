import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'tramvai',
  'Tramvai',
  'https://tramvai.dev/',
  'github.com/tramvaijs/tramvai-sandbox',
  decorateSelector(() => '#ffdd2d'),
  {
    distDir: 'dist',
    showOnHomePage: true,
    main: true,
    popular: true,
    showCube: false,
  }
);
