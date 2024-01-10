import Template from './template';
import { decorateSelector } from '../utils/decorate-selector';

export class DocusaurusTemplate extends Template {
  // The file to open by the editor
  getDefaultOpenedFiles() {
    return ['/src/pages/index.js'];
  }
}
export default new DocusaurusTemplate(
  'docusaurus',
  'Docusaurus',
  'https://docusaurus.io/',
  'github/facebook/docusaurus/tree/master/examples/classic',
  decorateSelector(() => '#3ECC5F'),
  {
    mainFile: [], // 🤔
    distDir: 'build',
    showOnHomePage: true,
  }
);
