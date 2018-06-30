import { dispatch } from 'codesandbox-api';
import Hook from 'console-feed/lib/Hook';

export default function setupConsole() {
  Hook(window.console, log => {
    dispatch({
      type: 'console',
      log,
    });
  });
}
