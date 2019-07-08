import { dispatch } from 'codesandbox-api';

export default {
  restartSandbox() {
    dispatch({ type: 'socket:message', channel: 'sandbox:restart' });
  },
};
