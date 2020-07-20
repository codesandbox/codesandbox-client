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

export type ManagerStatus =
  | 'initializing'
  | 'installing-dependencies'
  | 'transpiling'
  | 'evaluating'
  | 'running-tests'
  | 'idle';
