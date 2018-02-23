// @flow
import type { ComponentType } from 'react';

import { absolute } from 'common/utils/path';
import type { ConfigurationFile } from './configuration/types';
import configurations from './configuration';

type Options = {
  showOnHomePage?: boolean,
  distDir?: string,
  extraConfigurations?: {
    [path: string]: ConfigurationFile,
  },
  isTypescript?: boolean,
};

const defaultConfigurations = {
  '/package.json': configurations.packageJSON,
  '/.prettierrc': configurations.prettierRC,
  '/sandbox.config.json': configurations.sandboxConfig,
};

export default class Template {
  name: string;
  niceName: string;
  shortid: string;
  url: string;
  color: () => string;
  Icon: ComponentType<*>;

  showOnHomePage: boolean;
  distDir: string;
  configurationFiles: {
    [path: string]: ConfigurationFile,
  };
  isTypescript: boolean;

  constructor(
    name: string,
    niceName: string,
    url: string,
    shortid: string,
    Icon: ComponentType<*>,
    color: Function,
    options: Options = {}
  ) {
    this.name = name;
    this.niceName = niceName;
    this.url = url;
    this.shortid = shortid;
    this.color = color;
    this.Icon = Icon;

    this.showOnHomePage = options.showOnHomePage || false;
    this.distDir = options.distDir || 'build';
    this.configurationFiles = {
      ...defaultConfigurations,
      ...(options.extraConfigurations || {}),
    };
    this.isTypescript = options.isTypescript || false;
  }

  /**
   * Get possible entry files to evaluate, differs per template
   */
  getEntries(configurationFiles: { [type: string]: Object }): Array<string> {
    return [
      configurationFiles.package &&
        configurationFiles.package.parsed &&
        configurationFiles.package.parsed.main &&
        absolute(configurationFiles.package.parsed.main),
      '/index.' + (this.isTypescript ? 'ts' : 'js'),
      '/src/index.' + (this.isTypescript ? 'ts' : 'js'),
    ].filter(x => x);
  }

  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: {
    [type: string]: Object,
  }): Array<string> {
    return ['/public/index.html', '/index.html'];
  }

  /**
   * Alter the apiData to ZEIT for making deployment work
   */
  alterDeploymentData = (apiData: any) => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': `cd ${this.distDir} && serve -s ./`,
      },
    },
  });
}
