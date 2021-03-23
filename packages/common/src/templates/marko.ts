import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'marko',
  'Marko',
  'https://markojs.com/',
  'github/nm123github/marko-codesandbox',
  decorateSelector(() => '#f5ac00'),
  {
    showOnHomePage: true,
    main: false,
    staticDeployment: false,
  }
);
