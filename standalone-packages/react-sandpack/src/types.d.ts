export interface IFile {
  code: string;
}

export interface IFiles {
  [path: string]: IFile;
}

export interface IModule {
  code: string;
  path: string;
}

export interface IModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: Object | undefined;
}

export interface IModuleError {
  title: string;
  message: string;
  path: string;
  line: number;
  column: number;
}

export interface ITranspiledModule {
  module: IModule;
  query: string;
  source: IModuleSource | undefined;
  assets: {
    [name: string]: IModuleSource;
  };
  isEntry: boolean;
  isTestFile: boolean;
  childModules: Array<string>;
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: Array<IModuleSource>;
  initiators: Array<string>;
  dependencies: Array<string>;
  asyncDependencies: Array<string>;
  transpilationDependencies: Array<string>;
  transpilationInitiators: Array<string>;
}

export interface IManagerState {
  entry: string;
  transpiledModules: {
    [id: string]: ITranspiledModule;
  };
}

export type ISandpackContext = ISandpackState & {
  dispatch: (message: any) => void;
  listen: (listener: SandpackListener) => Function;
};

export interface ISandpackState {
  browserFrame: HTMLIFrameElement | null;
  managerState: IManagerState | undefined;
  openPaths: string[];
  activePath: string;
  errors: Array<IModuleError>;
  files: IFiles;
  updateCurrentFile: (file: IFile) => void;
  openFile: (path: string) => void;
  changeActiveFile: (path: string) => void;
}

export type SandpackListener = (msg: any) => void;

export type SandboxTemplate = {
  files: IFiles;
  dependencies: Record<string, string>;
  entry: string;
  main: string;
};

export type SandboxEnvironment =
  //| 'adonis'
  'create-react-app' | 'vue-cli';
// | 'preact-cli'
// | 'svelte'
// | 'create-react-app-typescript'
// | 'angular-cli'
// | 'parcel'
// | 'cxjs'
// | '@dojo/cli-create-app'
// | 'gatsby'
// | 'marko'
// | 'nuxt'
// | 'next'
// | 'reason'
// | 'apollo'
// | 'sapper'
// | 'nest'
// | 'static'
// | 'styleguidist'
// | 'gridsome'
// | 'vuepress'
// | 'mdx-deck'
// | 'quasar-framework'
// | 'unibit'
// | 'node'
// | 'ember'
// | 'custom'
// | 'babel-repl';

export type SandpackTheme = {
  palette: {
    highlightText: string;
    defaultText: string;
    inactive: string;
    mainBackground: string;
    inputBackground: string;
    accent: string;
  };
  syntax: {
    plain: string;
    disabled: string;
    keyword: string;
    definition: string;
    property: string;
    tag: string;
    static: string;
  };
};
