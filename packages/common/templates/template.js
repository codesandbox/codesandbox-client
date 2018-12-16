// @flow
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
  externalResourcesEnabled?: boolean,
  showCube?: boolean,
  isServer?: boolean,
  main?: boolean,
  backgroundColor?: () => string,
  mainFile?: Array<string>,
};

const defaultConfigurations = {
  '/package.json': configurations.packageJSON,
  '/.prettierrc': configurations.prettierRC,
  '/sandbox.config.json': configurations.sandboxConfig,
  '/now.json': configurations.nowConfig,
};

export default class Template {
  name: string;
  niceName: string;
  shortid: string;
  url: string;
  main: boolean;
  color: () => string;
  backgroundColor: ?() => string;

  showOnHomePage: boolean;
  distDir: string;
  configurationFiles: {
    [path: string]: ConfigurationFile,
  };
  isTypescript: boolean;
  externalResourcesEnabled: boolean;
  showCube: boolean;
  isServer: boolean;
  mainFile: ?Array<string>;

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

    this.isServer = options.isServer || false;
    this.main = options.main || false;
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

    this.mainFile = options.mainFile;
    this.backgroundColor = options.backgroundColor;

    this.showCube = options.showCube != null ? options.showCube : true;
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
      '/src/index.ts',
      '/src/index.js',
      ...(this.mainFile || []),
    ].filter(x => x);
  }

  /**
   * Files to be opened by default by the editor when opening the editor
   */
  getDefaultOpenedFiles(configurationFiles: {
    [type: string]: Object,
  }): Array<string> {
    return this.getEntries(configurationFiles);
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
  alterDeploymentData = (apiData: any) => {
    const packageJSONFile = apiData.files.find(x => x.file === 'package.json');
    const parsedFile = JSON.parse(packageJSONFile.data);

    const newParsedFile = {
      ...parsedFile,
      devDependencies: {
        ...parsedFile.devDependencies,
        serve: '^10.1.1',
      },
      scripts: {
        ...parsedFile.scripts,
        'now-start': `cd ${this.distDir} && serve -s ./`,
      },
    };

    return {
      ...apiData,
      files: [
        ...apiData.files.filter(x => x.file !== 'package.json'),
        {
          file: 'package.json',
          data: JSON.stringify(newParsedFile, null, 2),
        },
      ],
    };
  };
}
