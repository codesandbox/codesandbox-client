import { dispatch } from 'codesandbox-api';

import massageJSON from './massage-json';

function replaceConsoleMethod(method) {
  const oldMethod = console[method];
  console[method] = (...args) => {
    try {
      if (args.length > 0) {
        dispatch({
          type: 'console',
          method,
          args: massageJSON(args),
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
