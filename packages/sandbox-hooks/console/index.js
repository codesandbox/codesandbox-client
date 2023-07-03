import { dispatch, listen, iframeHandshake } from 'codesandbox-api';
import Hook from 'csb-console-feed/lib/Hook';
import { Encode } from 'csb-console-feed/lib/Transform';

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
