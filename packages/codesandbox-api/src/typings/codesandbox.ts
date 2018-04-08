export interface Module {
  id: string;
  title: string;
  code: string;
  shortid: string;
  directoryShortid: string | undefined;
  isNotSynced: boolean;
  sourceId: string;
}

export interface TranspiledModule {
  initiators: Set<TranspiledModule>;
  dependencies: Set<TranspiledModule>;
  transpilationDependencies: Set<TranspiledModule>;
  transpilationInitiators: Set<TranspiledModule>;
  childModules: Array<TranspiledModule>;

  source: {
    compiledCode: string;
  };
  module: Module;
}
