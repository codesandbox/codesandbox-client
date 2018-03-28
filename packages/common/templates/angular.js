// @flow

import { absolute, join } from 'common/utils/path';

import Template from './template';
import configurations from './configuration';
import { decorateSelector } from '../theme';

class AngularTemplate extends Template {
  /**
   * Override entry file because of angular-cli
   */
  getEntries(configurationFiles: { [type: string]: Object }): Array<string> {
    const entries = [];
    const { parsed } = configurationFiles['angular-cli'];

    const app = parsed.apps && parsed.apps[0];

    if (parsed) {
      if (app && app.root && app.main) {
        entries.push(absolute(join(app.root, app.main)));
      }
    }

    if (
      configurationFiles.package.parsed &&
      configurationFiles.package.parsed.main
    ) {
      entries.push(absolute(configurationFiles.package.parsed.main));
    }

    entries.push('/src/main.ts');
    entries.push('/main.ts');

    return entries;
  }

  getHTMLEntries(configurationFiles: {
    [type: string]: Object,
  }): Array<string> {
    const entries = [];
    const { parsed } = configurationFiles['angular-cli'];

    if (parsed) {
      const app = parsed.apps && parsed.apps[0];
      if (app && app.root && app.index) {
        entries.push(absolute(join(app.root, app.index)));
      }
    }

    entries.push('/public/index.html');
    entries.push('/index.html');

    return entries;
  }
}

export default new AngularTemplate(
  'angular-cli',
  'Angular',
  'https://github.com/angular/angular',
  'angular',
  decorateSelector(() => '#DD0031'),
  {
    extraConfigurations: {
      '/.angular-cli.json': configurations.angularCli,
    },
    isTypescript: true,
    distDir: 'dist',
    showOnHomePage: true,
  }
);
