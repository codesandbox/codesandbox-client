import { absolute } from '../utils/path';
import {
  ConfigurationFile,
  ParsedConfigurationFile,
} from './configuration/types';
import configurations from './configuration';
import { isServer } from './helpers/is-server';
import { TemplateType } from '.';
import { PackageJSON } from '../types';

export type Options = {
  showOnHomePage?: boolean;
  distDir?: string;
  netlify?: boolean;
  popular?: boolean;
  extraConfigurations?: {
    [path: string]: ConfigurationFile;
  };
  isTypescript?: boolean;
  externalResourcesEnabled?: boolean;
  showCube?: boolean;
  main?: boolean;
  backgroundColor?: () => string;
  mainFile?: string[];
  defaultOpenedFile?: string[];
};

export type ConfigurationFiles = {
  [path: string]: ConfigurationFile;
};

export type Dependencies = { [name: string]: string };

export type ParsedConfigurationFiles = {
  package?: ParsedConfigurationFile<PackageJSON>;
  [path: string]: ParsedConfigurationFile<any> | undefined;
};

const defaultConfigurations = {
  '/package.json': configurations.packageJSON,
  '/.prettierrc': configurations.prettierRC,
  '/sandbox.config.json': configurations.sandboxConfig,
  '/vercel.json': configurations.nowConfig,
  '/netlify.toml': configurations.netlifyConfig,
};

export interface ViewTab {
  id: string;
  closeable?: boolean;
  options?: any;
}

export type ViewConfig = {
  open?: boolean;
  views: ViewTab[];
};

const CLIENT_VIEWS: ViewConfig[] = [
  {
    views: [{ id: 'codesandbox.browser' }, { id: 'codesandbox.tests' }],
  },
  {
    views: [{ id: 'codesandbox.console' }, { id: 'codesandbox.problems' }],
  },
];

const SERVER_VIEWS: ViewConfig[] = [
  {
    views: [{ id: 'codesandbox.browser' }],
  },
  {
    open: true,
    views: [
      { id: 'codesandbox.terminal' },
      { id: 'codesandbox.console' },
      { id: 'codesandbox.problems' },
    ],
  },
];

export default class Template {
  name: TemplateType;
  niceName: string;
  shortid: string;
  url: string;
  main: boolean;
  color: () => string;
  backgroundColor: () => string | undefined;

  popular: boolean;
  showOnHomePage: boolean;
  distDir: string;
  netlify: boolean;
  configurationFiles: ConfigurationFiles;
  isTypescript: boolean;
  externalResourcesEnabled: boolean;
  showCube: boolean;
  isServer: boolean;
  mainFile: undefined | string[];
  defaultOpenedFile: string[];

  constructor(
    name: TemplateType,
    niceName: string,
    url: string,
    shortid: string,
    color: () => string,
    options: Options = {}
  ) {
    this.name = name;
    this.niceName = niceName;
    this.url = url;
    this.shortid = shortid;
    this.color = color;

    this.popular = options.popular || false;
    this.isServer = isServer(this.name);
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
    this.netlify = options.netlify;
    this.backgroundColor = options.backgroundColor;

    this.showCube = options.showCube != null ? options.showCube : true;
    this.defaultOpenedFile = options.defaultOpenedFile || [];
  }

  // eslint-disable-next-line
  private getMainFromPackage(pkg: {
    main?: string[] | string;
  }): string | undefined {
    try {
      if (!pkg.main) {
        return undefined;
      }

      if (Array.isArray(pkg.main)) {
        return absolute(pkg.main[0]);
      }

      if (typeof pkg.main === 'string') {
        return absolute(pkg.main);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  }

  /**
   * Get possible entry files to evaluate, differs per template
   */
  getEntries(configurationFiles: ParsedConfigurationFiles): string[] {
    return [
      configurationFiles.package?.parsed &&
        this.getMainFromPackage(configurationFiles.package.parsed),
      ...(this.mainFile || []),
      '/index.' + (this.isTypescript ? 'ts' : 'js'),
      '/src/index.' + (this.isTypescript ? 'ts' : 'js'),
      '/src/index.ts',
      '/src/index.tsx',
      '/src/index.js',
      '/src/pages/index.js',
      '/src/pages/index.vue',
      '/index.js',
      '/index.ts',
      '/index.tsx',
      '/README.md',
      '/package.json',
    ].filter(x => x);
  }

  /**
   * Files to be opened by default by the editor when opening the editor
   */
  getDefaultOpenedFiles(
    configurationFiles: ParsedConfigurationFiles
  ): string[] {
    return [...this.defaultOpenedFile, ...this.getEntries(configurationFiles)];
  }

  /**
   * Get the views that are tied to the template
   */
  getViews(configurationFiles: ParsedConfigurationFiles): ViewConfig[] {
    if (this.isServer) {
      return SERVER_VIEWS;
    }
    return CLIENT_VIEWS;
  }

  // eslint-disable-next-line no-unused-vars
  getHTMLEntries(configurationFiles: ParsedConfigurationFiles): string[] {
    return ['/public/index.html', '/index.html'];
  }

  /**
   * Alter the apiData to Vercel for making deployment work
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
        'now-start': `cd ${this.distDir} && serve -s ./`,
        ...parsedFile.scripts,
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
