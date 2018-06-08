// @flow

import { absolute, join } from 'common/utils/path';

import Template from './template';
import configurations from './configuration';
import { decorateSelector } from '../theme';

function getAngularCLIEntries(parsed) {
  const entries = [];

  const app = parsed.apps && parsed.apps[0];

  if (parsed) {
    if (app && app.root && app.main) {
      entries.push(absolute(join(app.root, app.main)));
    }
  }

  return entries;
}

function getAngularJSONEntries(parsed) {
  const entries = [];
  const defaultProject = parsed.defaultProject;
  const project = parsed.projects[defaultProject];
  const build = project.architect.build;

  if (build.options.main) {
    entries.push(absolute(join(project.root, build.options.main)));
  }

  return entries;
}

function getAngularCLIHTMLEntry(parsed) {
  const app = parsed.apps && parsed.apps[0];
  if (app && app.root && app.index) {
    return [absolute(join(app.root, app.index))];
  }

  return [];
}

function getAngularJSONHTMLEntry(parsed) {
  const defaultProject = parsed.defaultProject;
  const project = parsed.projects[defaultProject];
  const build = project.architect.build;

  if (build && project.root != null && build.options && build.options.index) {
    return [absolute(join(project.root, build.options.index))];
  }

  return [];
}

class AngularTemplate extends Template {
  /**
   * Override entry file because of angular-cli
   */
  getEntries(configurationFiles: { [type: string]: Object }): Array<string> {
    let entries = [];

    if (!configurationFiles['angular-config'].generated) {
      const { parsed } = configurationFiles['angular-config'];
      entries = entries.concat(getAngularJSONEntries(parsed));
    } else {
      const { parsed } = configurationFiles['angular-cli'];
      entries = entries.concat(getAngularCLIEntries(parsed));
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
    let entries = [];

    if (!configurationFiles['angular-config'].generated) {
      const { parsed } = configurationFiles['angular-config'];
      entries = entries.concat(getAngularJSONHTMLEntry(parsed));
    } else {
      const { parsed } = configurationFiles['angular-cli'];
      entries = entries.concat(getAngularCLIHTMLEntry(parsed));
    }

    entries.push('/public/index.html');
    entries.push('/index.html');

    console.log(entries);

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
      '/angular.json': configurations.angularJSON,
    },
    isTypescript: true,
    distDir: 'dist',
    showOnHomePage: true,
  }
);
