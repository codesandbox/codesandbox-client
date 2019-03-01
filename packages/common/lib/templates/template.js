'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const path_1 = require('../utils/path');
const configuration_1 = require('./configuration');
const defaultConfigurations = {
  '/package.json': configuration_1.default.packageJSON,
  '/.prettierrc': configuration_1.default.prettierRC,
  '/sandbox.config.json': configuration_1.default.sandboxConfig,
  '/now.json': configuration_1.default.nowConfig,
};
class Template {
  constructor(name, niceName, url, shortid, color, options = {}) {
    /**
     * Alter the apiData to ZEIT for making deployment work
     */
    this.alterDeploymentData = apiData => {
      const packageJSONFile = apiData.files.find(
        x => x.file === 'package.json'
      );
      const parsedFile = JSON.parse(packageJSONFile.data);
      const newParsedFile = Object.assign({}, parsedFile, {
        devDependencies: Object.assign({}, parsedFile.devDependencies, {
          serve: '^10.1.1',
        }),
        scripts: Object.assign(
          { 'now-start': `cd ${this.distDir} && serve -s ./` },
          parsedFile.scripts
        ),
      });
      return Object.assign({}, apiData, {
        files: [
          ...apiData.files.filter(x => x.file !== 'package.json'),
          {
            file: 'package.json',
            data: JSON.stringify(newParsedFile, null, 2),
          },
        ],
      });
    };
    this.name = name;
    this.niceName = niceName;
    this.url = url;
    this.shortid = shortid;
    this.color = color;
    this.isServer = options.isServer || false;
    this.main = options.main || false;
    this.showOnHomePage = options.showOnHomePage || false;
    this.distDir = options.distDir || 'build';
    this.configurationFiles = Object.assign(
      {},
      defaultConfigurations,
      options.extraConfigurations || {}
    );
    this.isTypescript = options.isTypescript || false;
    this.externalResourcesEnabled =
      options.externalResourcesEnabled != null
        ? options.externalResourcesEnabled
        : true;
    this.mainFile = options.mainFile;
    this.backgroundColor = options.backgroundColor;
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
        path_1.absolute(configurationFiles.package.parsed.main),
      '/index.' + (this.isTypescript ? 'ts' : 'js'),
      '/src/index.' + (this.isTypescript ? 'ts' : 'js'),
      '/src/index.ts',
      '/src/index.js',
      ...(this.mainFile || []),
    ].filter(x => x);
  }
  /**
   * Files to be opened by default by the editor when opening the editor
   */
  getDefaultOpenedFiles(configurationFiles) {
    return this.getEntries(configurationFiles);
  }
  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles) {
    return ['/public/index.html', '/index.html'];
  }
}
exports.default = Template;
