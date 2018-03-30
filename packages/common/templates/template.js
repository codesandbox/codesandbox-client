<<<<<<< HEAD
// @flow
=======
>>>>>>> more fixes
import { absolute } from 'common/utils/path';
import configurations from './configuration';

const defaultConfigurations = {
  '/package.json': configurations.packageJSON,
  '/.prettierrc': configurations.prettierRC,
  '/sandbox.config.json': configurations.sandboxConfig,
};

export default class Template {
<<<<<<< HEAD
  name: string;
  niceName: string;
  shortid: string;
  url: string;
  color: () => string;
=======
  name;
  niceName;
  shortid;
  url;
  color;
  Icon;
>>>>>>> more fixes

  showOnHomePage;
  distDir;
  configurationFiles;
  isTypescript;
  externalResourcesEnabled;
  showCube;

<<<<<<< HEAD
  constructor(
    name: string,
    niceName: string,
    url: string,
    shortid: string,
    color: Function,
    options: Options = {}
  ) {
=======
  constructor(name, niceName, url, shortid, Icon, color, options) {
>>>>>>> more fixes
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
    this.externalResourcesEnabled =
      options.externalResourcesEnabled != null
        ? options.externalResourcesEnabled
        : true;

    this.showCube = options.showCube != null ? options.showCube : true;
  }

  /**
   * Get possible entry files to evaluate, differs per template
   */
  getEntries(configurationFiles) {
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
  getHTMLEntries(configurationFiles) {
    return ['/public/index.html', '/index.html'];
  }

  /**
   * Alter the apiData to ZEIT for making deployment work
   */
  alterDeploymentData = apiData => ({
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
