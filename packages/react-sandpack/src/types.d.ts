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

export interface ISandpackContext {
  browserFrame: HTMLIFrameElement | null;
  managerState: IManagerState | undefined;
  bundlerURL: string | undefined;
  openedPath: string;
  files: IFiles;
  openFile: (path: string) => void;
  updateFiles: (files: IFiles) => void;
}
