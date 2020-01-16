import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export class RaxTemplate extends Template {
  // The file to open by the editor
  getDefaultOpenedFiles() {
    return ['/src/app.js'];
  }
}
export default new RaxTemplate(
  'rax',
  'Rax',
  'https://rax.js.org/',
  'github/raxjs/rax-codesandbox-template',
  decorateSelector(() => '#FFB006'),
  {
    showOnHomePage: true,
    distDir: 'build',
    mainFile: []
  }
);
