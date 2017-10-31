import { dispatch } from 'codesandbox-api';

import transformJSON from './transform-json';

function replaceConsoleMethod(method) {
  const oldMethod = console[method];
  console[method] = (...args) => {
    try {
      if (method === 'clear') {
        dispatch({ type: 'clear-console' });
      } else if (args.length > 0) {
        dispatch({
          type: 'console',
          method,
          args: transformJSON(args),
        });
      }
    } catch (e) {
      dispatch({
        type: 'console',
        method,
        args: JSON.stringify(['Unknown message, open your console to see it.']),
      });
    }
    oldMethod.apply(console, args);
  };
}

export default function setupConsole() {
  ['log', 'info', 'warn', 'error', 'debug'].forEach(method =>
    replaceConsoleMethod(method)
  );
}
