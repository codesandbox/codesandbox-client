import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';

class RaxTemplate extends Template {
  getEntries(configurationFiles: ParsedConfigurationFiles) {
    const entries = super.getEntries(configurationFiles);

    entries.push('/src/app.js');
    return entries;
  }
}

export default new RaxTemplate(
  'rax-cli',
  'Rax',
  'https://rax.js.org/',
  'github/raxjs/rax-codesandbox-template',
  decorateSelector(() => '#FFB006'),
  {
    mainFile: ['/src/app.js'],
    distDir: 'build',
    showOnHomePage: true,
  }
);
