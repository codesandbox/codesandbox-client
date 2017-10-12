import { dispatch } from 'codesandbox-api';

function replaceConsoleMethod(method) {
  const oldMethod = console[method];
  console[method] = (...args) => {
    dispatch({
      type: 'console',
      method,
      args: JSON.stringify(args),
    });
    oldMethod.apply(console, args);
  };
}

export default function setupConsole() {
  ['log', 'info', 'warn', 'error', 'debug'].forEach(method =>
    replaceConsoleMethod(method)
  );
}
