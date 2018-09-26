self.window = self;

importScripts(
  'https://cdn.rawgit.com/jaredly/docre/70303ec3/static/bs-3.0.0.js'
);
importScripts('https://reason.surge.sh/bucklescript-deps.js');

self.postMessage('ready');

self.addEventListener('message', ev => {
  const { codesandbox, code } = ev.data;

  if (!codesandbox) {
    return;
  }

  const { js_code } = self.ocaml.reason_compile_super_errors(code);

  self.postMessage({ transpiledCode: js_code });
});
