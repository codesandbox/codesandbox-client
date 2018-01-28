// @flow
import type { ComponentType } from 'react';
import type { PackageJSON } from 'common/types';
import type { ConfigurationFile } from './configuration/types';
import configurations from './configuration';

import { packageMainResolver } from './resolvers/entry';

type Module = {
  code: string,
  path: string,
};

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
  Icon: ?ComponentType<*>;

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
    color: Function,
    options: Options = {}
  ) {
    this.name = name;
    this.niceName = niceName;
    this.url = url;
    this.shortid = shortid;
    this.color = color;

    this.showOnHomePage = options.showOnHomePage || false;
    this.distDir = options.distDir || 'build';
    this.configurationFiles = {
      ...defaultConfigurations,
      ...(options.extraConfigurations || {}),
    };
    this.isTypescript = options.isTypescript || false;
  }

  /**
   * Get entry file to evaluate, differs per template
   */
  getEntry = (
    modules: { [path: string]: Module },
    parsedPackageJSON: PackageJSON
  ) => [parsedPackageJSON.main, '/index.js', '/src/index.js'];

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
