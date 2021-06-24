import { ChildHandler } from '../worker-transpiler/child-handler';

// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
const childHandler = new ChildHandler('stencil-worker');

type StencilOpts = { file: string; module: string };
type StencilResult = {
  imports: Array<{
    path: string;
  }>;
  code: string;
};

const ctx = self as typeof self & {
  stencil: {
    compile(code: string, opts: StencilOpts): Promise<StencilResult>;
  };
};

let loadedStencilVersion: string;
const loadStencilVersion = (version: string) => {
  if (version !== loadedStencilVersion) {
    loadedStencilVersion = version;

    ctx.importScripts(
      `https://unpkg.com/@stencil/core@${version}/compiler/stencil.js`
    );
  }
};

ctx.importScripts('https://unpkg.com/typescript@3.5.3/lib/typescript.js');

async function compileStencil(data) {
  const { code, path, stencilVersion } = data;

  loadStencilVersion(stencilVersion);

  const opts = {
    file: path,
    module: 'cjs',
  };

  const results = await ctx.stencil.compile(code, opts);
  return {
    // Code won't execute with an import.meta in the code, so removing it now as a hack
    transpiledCode: results.code.replace(/^.*import\.meta.*$/gm, ''),
    dependencies: results.imports.map(i => ({ path: i.path })),
  };
}

childHandler.registerFunction('compile', compileStencil);
childHandler.emitReady();
