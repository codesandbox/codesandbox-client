import { dispatch, listen, iframeHandshake } from 'codesandbox-api';
import Hook from 'console-feed/lib/Hook';
import { Encode } from 'console-feed/lib/Transform';

export default function setupConsole() {
  Hook(window.console, async log => {
    await iframeHandshake;
    dispatch({
      type: 'console',
      log,
    });
  });

  function handleMessage(data, source) {
    if (source) {
      if (data.type === 'evaluate') {
        let result = null;
        let error = false;
        try {
          // Attempt to wrap command in parentheses, fixing issues
          // where directly returning objects results in unexpected
          // behaviour.
          if (data.command && data.command.charAt(0) === '{') {
            try {
              const wrapped = `(${data.command})`;
              // `new Function` is used to validate Javascript syntax
              // eslint-disable-next-line
              const validate = new Function(wrapped);
              data.command = wrapped;
            } catch (e) {
              // We shouldn't wrap the expression
            }
          }

          result = (0, eval)(data.command); // eslint-disable-line no-eval
        } catch (e) {
          result = e;
          error = true;
        }

        try {
          dispatch({
            type: 'eval-result',
            error,
            result: Encode(result),
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  return listen(handleMessage);
}

const isIFramePreview = window.top !== window.self;

const insideCodeSandboxPreview =
  window.location.host.endsWith('csb.app') ||
  window.location.host.endsWith('csb.dev');

// Only run this script in editor context
if (isIFramePreview && insideCodeSandboxPreview) {
  // This is a temporary fix for deprecating the V1 editor. We need to load both V1 and V2 preview protocol
  // and this is the simplest way to achieve that. Later everything will be V2 preview protocol
  (function LoadV2PreviewProtocol() {
    const script = document.createElement('script');
    script.src = 'https://codesandbox.io/p/preview-protocol.js';
    script.async = true;
    script.defer = true;
    (document.head || document.documentElement).prepend(script);
  })();

  // This script is used to enable Chrome DevTools functionality
  (function ChromeDevtools() {
    const script = document.createElement('script');
    script.src = 'https://codesandbox.io/p/chrome-devtool/protocol/index.js';

    script.onload = () => {
      const devtoolProtocol = window.chobitsu;
      if (devtoolProtocol) {
        window.addEventListener('message', event => {
          const { type, data } = event.data;

          if (type === 'FROM_DEVTOOL') {
            devtoolProtocol.sendRawMessage(data);
          }
        });

        devtoolProtocol.setOnMessage(data => {
          if (data.includes('"id":"tmp')) {
            return;
          }

          window.parent.postMessage({ type: 'TO_DEVTOOL', data }, '*');
        });

        devtoolProtocol.sendRawMessage(
          `{"id":5,"method":"Runtime.enable","params":{}}`
        );
      }
    };

    (document.head || document.documentElement).prepend(script);
  })();
}
