import { dispatch } from 'codesandbox-api';

import mapConsoleResult from './utils/map-console-result';

function mapArgs(args: any[]) {
  return args.map(mapConsoleResult);
}

function replaceConsoleMethod(method) {
  const oldMethod = console[method];
  console[method] = (...args) => {
    try {
      const mappedArgs = mapArgs(args);

      if (mappedArgs.length > 0) {
        dispatch({
          type: 'console',
          method,
          args: JSON.stringify(mappedArgs),
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
