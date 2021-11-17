import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export default new Template(
  'gsap',
  'GSAP',
  'https://greensock.com/gsap/',
  'github/example/example',
  decorateSelector(() => '#8ac640'),
  {
    mainFile: ['/src/index.html'], // TODO
    showOnHomePage: true, // TODO 
    staticDeployment: false, // TODO
  }
);
