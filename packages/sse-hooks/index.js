import hookConsole from 'sandbox-hooks/console';
import setupHistoryListeners from 'sandbox-hooks/url-listeners';
import { dispatch } from 'codesandbox-api';

hookConsole();
setupHistoryListeners();
dispatch({ type: 'initialized' });
