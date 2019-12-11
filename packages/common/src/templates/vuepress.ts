import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export class VuePressTemplate extends Template {
  // The file to open by the editor
  getDefaultOpenedFiles() {
    return ['/README.md', '/guide/README.md'];
  }
}
export default new VuePressTemplate(
  'vuepress',
  'VuePress',
  'https://vuepress.vuejs.org/',
  'github/vicbergquist/codesandbox-vuepress',
  decorateSelector(() => '#4abf8a'),
  {
    mainFile: [], // 🤔
    distDir: '.vuepress/dist',
    showOnHomePage: true,
  }
);
