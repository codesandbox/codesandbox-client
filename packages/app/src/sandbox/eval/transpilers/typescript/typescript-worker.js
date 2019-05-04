import { buildWorkerError } from '../utils/worker-error-handler';
import getDependencies from './get-require-statements';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/3.4.1/typescript.min.js',
]);

self.postMessage('ready');

declare var ts: {
  transpileModule: (
    code: string,
    config: Object
  ) => {
    diagnostics: string[],
    outputText: string,
    sourceMapText: string,
  },
  registerPlugin: (name: string, plugin: Function) => void,
};

self.addEventListener('message', event => {
  const { code, path, config, typescriptVersion } = event.data;

  if (typescriptVersion !== '3.4.1') {
    self.importScripts(
      `https://unpkg.com/typescript@${typescriptVersion}/lib/typescript.js`
    );
  }

  const defaultConfig = {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      allowJs: true,
      alwaysStrict: true,
      downlevelIteration: true,
      noImplicitUseStrict: false,
      jsx: ts.JsxEmit.React,
      forceConsistentCasingInFileNames: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noImplicitAny: true,
      strictNullChecks: true,
      suppressImplicitAnyIndexErrors: true,
      noUnusedLocals: true,
      inlineSourceMap: true,
      inlineSources: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      lib: ['es2017', 'dom'],
    },
  };

  let finalConfig = { ...defaultConfig };

  if (config) {
    finalConfig = { ...config };
    finalConfig.compilerOptions = {
      ...config.compilerOptions,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      inlineSourceMap: true,
      inlineSources: true,
      emitDecoratorMetadata: true,
    };
  }

  finalConfig.fileName = path;
  finalConfig.reportDiagnostics = true;

  try {
    const { outputText: compiledCode } = ts.transpileModule(code, finalConfig);

    const sourceFile = ts.createSourceFile(
      path,
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    const dependencies = getDependencies(sourceFile, self.ts);

    dependencies.forEach(dependency => {
      self.postMessage({
        type: 'add-dependency',
        path: dependency.path,
        isGlob: dependency.type === 'glob',
      });
    });

    self.postMessage({
      type: 'result',
      transpiledCode: compiledCode,
    });
  } catch (e) {
    self.postMessage({
      type: 'error',
      error: buildWorkerError(e),
    });
  }
});
