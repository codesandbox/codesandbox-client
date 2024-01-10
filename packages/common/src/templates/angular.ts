import { absolute, join } from '../utils/path';

import Template, { ParsedConfigurationFiles } from './template';
import configurations from './configuration';
import { decorateSelector } from '../utils/decorate-selector';

function getAngularCLIEntries(parsed) {
  const entries = [];

  if (parsed) {
    const app = parsed.apps && parsed.apps[0];
    if (app && app.root && app.main) {
      entries.push(absolute(join(app.root, app.main)));
    }
  }

  return entries;
}

function getAngularJSONEntries(parsed) {
  const entries = [];

  if (parsed) {
    const { defaultProject } = parsed;
    const project = parsed.projects[defaultProject];

    if (project && project.architect) {
      const { build } = project.architect;
      if (build.options.main) {
        entries.push(absolute(join(project.root, build.options.main)));
      }
    }
  }

  return entries;
}

function getAngularCLIHTMLEntry(parsed) {
  if (parsed) {
    const app = parsed.apps && parsed.apps[0];
    if (app && app.root && app.index) {
      return [absolute(join(app.root, app.index))];
    }
  }

  return [];
}

function getAngularJSONHTMLEntry(parsed) {
  if (parsed) {
    const { defaultProject } = parsed;
    const project = parsed.projects[defaultProject];

    if (project && project.architect) {
      const { build } = project.architect;
      if (
        build &&
        project.root != null &&
        build.options &&
        build.options.index
      ) {
        return [absolute(join(project.root, build.options.index))];
      }
    }
  }

  return [];
}

class AngularTemplate extends Template {
  /**
   * Override entry file because of angular-cli
   */
  getEntries(configurationFiles: ParsedConfigurationFiles): Array<string> {
    let entries = [];

    try {
      if (!configurationFiles['angular-config'].generated) {
        const { parsed } = configurationFiles['angular-config'];
        entries = entries.concat(getAngularJSONEntries(parsed));
      } else {
        const { parsed } = configurationFiles['angular-cli'];
        entries = entries.concat(getAngularCLIEntries(parsed));
      }
    } catch (e) {
      console.warn(
        `${configurationFiles['angular-config'].path} is malformed: ${e.message}`
      );
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

  getHTMLEntries(configurationFiles: ParsedConfigurationFiles): Array<string> {
    let entries = [];

    if (!configurationFiles['angular-config'].generated) {
      const { parsed } = configurationFiles['angular-config'];
      entries = entries.concat(getAngularJSONHTMLEntry(parsed));
    } else if (configurationFiles['angular-cli']) {
      const { parsed } = configurationFiles['angular-cli'];
      entries = entries.concat(getAngularCLIHTMLEntry(parsed));
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
      '/angular.json': configurations.angularJSON,
      '/tsconfig.json': configurations.tsconfig,
    },
    staticDeployment: false,
    isTypescript: true,
    distDir: 'dist',
    showOnHomePage: true,
    popular: true,
    main: true,
  }
);
