import { buildWorkerError } from '../utils/worker-error-handler';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/2.5.0/typescript.min.js',
]);

self.postMessage('ready');

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
  const { code, path } = event.data;

  const config = {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      allowJs: true,
      alwaysStrict: true,
      downlevelIteration: true,
      noImplicitUseStrict: false,
      inlineSourceMap: true,
      inlineSources: true,
      experimentalDecorators: true,
      jsx: ts.JsxEmit.React,
    },
  };

  try {
    const { outputText: compiledCode } = ts.transpileModule(code, config);

    self.postMessage({
      type: 'compiled',
      transpiledCode: compiledCode,
    });
  } catch (e) {
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
