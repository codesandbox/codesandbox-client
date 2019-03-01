'use strict';
// @flow
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = require('../utils/path');
const template_1 = require('./template');
const configuration_1 = require('./configuration');
const theme_1 = require('../theme');
function getAngularCLIEntries(parsed) {
  const entries = [];
  if (parsed) {
    const app = parsed.apps && parsed.apps[0];
    if (app && app.root && app.main) {
      entries.push(path_1.absolute(path_1.join(app.root, app.main)));
    }
  }
  return entries;
}
function getAngularJSONEntries(parsed) {
  const entries = [];
  if (parsed) {
    const defaultProject = parsed.defaultProject;
    const project = parsed.projects[defaultProject];
    const build = project.architect.build;
    if (build.options.main) {
      entries.push(
        path_1.absolute(path_1.join(project.root, build.options.main))
      );
    }
  }
  return entries;
}
function getAngularCLIHTMLEntry(parsed) {
  if (parsed) {
    const app = parsed.apps && parsed.apps[0];
    if (app && app.root && app.index) {
      return [path_1.absolute(path_1.join(app.root, app.index))];
    }
  }
  return [];
}
function getAngularJSONHTMLEntry(parsed) {
  if (parsed) {
    const defaultProject = parsed.defaultProject;
    const project = parsed.projects[defaultProject];
    const build = project.architect.build;
    if (build && project.root != null && build.options && build.options.index) {
      return [path_1.absolute(path_1.join(project.root, build.options.index))];
    }
  }
  return [];
}
class AngularTemplate extends template_1.default {
  /**
   * Override entry file because of angular-cli
   */
  getEntries(configurationFiles) {
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
      entries.push(path_1.absolute(configurationFiles.package.parsed.main));
    }
    entries.push('/src/main.ts');
    entries.push('/main.ts');
    return entries;
  }
  getHTMLEntries(configurationFiles) {
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
    return entries;
  }
}
exports.default = new AngularTemplate(
  'angular-cli',
  'Angular',
  'https://github.com/angular/angular',
  'angular',
  theme_1.decorateSelector(() => '#DD0031'),
  {
    extraConfigurations: {
      '/.angular-cli.json': configuration_1.default.angularCli,
      '/angular.json': configuration_1.default.angularJSON,
    },
    isTypescript: true,
    distDir: 'dist',
    showOnHomePage: true,
    main: true,
  }
);
