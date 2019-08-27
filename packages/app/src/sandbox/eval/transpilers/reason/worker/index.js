self.window = self;

self.importScripts(
  'https://cdn.jsdelivr.net/gh/jaredly/reason-react@more-docs/docs/bucklescript.js'
);
self.importScripts('https://reason.surge.sh/bucklescript-deps.js');

self.postMessage('ready');

self.addEventListener('message', ev => {
  const { codesandbox, code } = ev.data;

  if (!codesandbox) {
    return;
  }

  // eslint-disable-next-line camelcase
  const { js_code } = self.ocaml.reason_compile_super_errors(code);

  self.postMessage({ transpiledCode: js_code });
});
