import type * as TypeScriptType from 'typescript';
import getDependencies from './get-require-statements';
import { ChildHandler } from '../worker-transpiler/child-handler';

const childHandler = new ChildHandler('typescript-worker');

self.importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/3.4.1/typescript.min.js'
);

declare const ts: typeof TypeScriptType;

async function compile(data) {
  const { code, path, config, typescriptVersion } = data;

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

  const { outputText: compiledCode } = ts.transpileModule(code, finalConfig);

  const sourceFile = ts.createSourceFile(
    path,
    compiledCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const dependencies = getDependencies(sourceFile, ts);
  return {
    transpiledCode: compiledCode,
    foundDependencies: dependencies.map(dependency => ({
      path: dependency.path,
      isGlob: dependency.type === 'glob',
    })),
  };
}

childHandler.registerFunction('compile', compile);
childHandler.emitReady();
