const ctx = self as any;

ctx.importScripts('https://unpkg.com/typescript@3.5.3/lib/typescript.js');
ctx.importScripts(
  'https://unpkg.com/@stencil/core@1.2.0-0/compiler/stencil.js'
);
ctx.postMessage('ready');

ctx.addEventListener('message', event => {
  const { code, path } = event.data;

  const opts = {
    file: path,
    module: 'cjs',
  };

  ctx.stencil.compile(code, opts).then(results => {
    console.log(results.diagnostics);
    console.log(results.code);

    ctx.postMessage({
      type: 'result',
      // Code won't execute with an import.meta in the code, so removing it now as a hack
      transpiledCode: results.code.replace(/^.*import\.meta.*$/gm, ''),
    });
  });
});
