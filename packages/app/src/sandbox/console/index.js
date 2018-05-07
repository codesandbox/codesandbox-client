import { dispatch } from 'codesandbox-api';
import { Hook } from 'console-feed';

export default function setupConsole() {
  Hook(window.console, log => {
    dispatch({
      type: 'console',
      log,
    });
  });
}
