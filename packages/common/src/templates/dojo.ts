import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

export class DojoTemplate extends Template {
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: ParsedConfigurationFiles): string[] {
    return ['/src/index.html'];
  }

  getEntries(configurationFiles: ParsedConfigurationFiles) {
    const entries = super.getEntries(configurationFiles);
    entries.push('/src/main.ts');
    return entries;
  }
}

export default new DojoTemplate(
  '@dojo/cli-create-app',
  'Dojo',
  'https://github.com/dojo/cli-create-app',
  'github/dojo/dojo-codesandbox-template',
  decorateSelector(() => '#D3471C'),
  {
    showOnHomePage: true,
    showCube: false,
    distDir: 'output/dist',
    isTypescript: true,
    githubPagesDeploy: false,
    extraConfigurations: {
      '/tsconfig.json': configurations.tsconfig,
    },
  }
);
