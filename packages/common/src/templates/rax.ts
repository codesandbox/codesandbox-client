import Template, { ParsedConfigurationFiles } from './template';
import { decorateSelector } from '../utils/decorate-selector';
import configurations from './configuration';

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
  'https://github.com/raxjs/rax-scripts/tree/master/packages/rax-cli',
  'github/raxjs/rax-codesandbox-template',
  decorateSelector(() => '#FFB006'),
  {
    showOnHomePage: true,
    extraConfigurations: {
      '/.babelrc': configurations.babelrc,
    },
    distDir: 'build',
    main: true,
    popular: true,
    mainFile: ['/src/app.js'],
  }
);
