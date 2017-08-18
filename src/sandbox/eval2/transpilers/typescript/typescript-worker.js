import { buildWorkerError } from '../worker-transpiler';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/2.5.0/typescript.min.js',
]);

declare var ts: {
  transpileModule: (
    code: string,
    config: Object,
  ) => {
    diagnostics: string[],
    outputText: string,
    sourceMapText: string,
  },
  registerPlugin: (name: string, plugin: Function) => void,
};

self.addEventListener('message', event => {
  const { code, path, id } = event.data;

  const config = {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      allowJs: true,
      alwaysStrict: true,
      downlevelIteration: true,
      newLine: ts.NewLineKind.LineFeed,
      noImplicitUseStrict: false,
      inlineSourceMap: true,
    },
  };

  try {
    const { outputText: compiledCode } = ts.transpileModule(code, config);

    self.postMessage({
      type: 'compiled',
      code: compiledCode,
      id,
    });
  } catch (e) {
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
      id,
    });
  }
});
