self.window = self;

importScripts(
  'https://cdn.jsdelivr.net/gh/jaredly/reason-react@more-docs/docs/bucklescript.js'
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
