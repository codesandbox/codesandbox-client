import { dispatch, listen } from 'codesandbox-api';

const listeners = new Map();

export default {
  listen(action: ({ data }) => void): () => void {
    if (listeners.get(action)) {
      listeners.get(action)();
    }

    const disposer = listen(data => {
      action({ data: data || {} });
    });
    listeners.set(action, disposer);

    return disposer;
  },
  restartSandbox() {
    dispatch({ type: 'socket:message', channel: 'sandbox:restart' });
  },
  disconnectSSE() {
    dispatch({ type: 'codesandbox:sse:disconnect' });
  },
  logTerminalMessage(data: any) {
    dispatch({
      type: 'terminal:message',
      data,
    });
  },
  exitShell(data: any) {
    const { id, code, signal } = data;

    dispatch({
      type: 'shell:exit',
      code,
      signal,
      id,
    });
  },
  outShell(dataArg: any) {
    const { id, data } = dataArg;

    dispatch({
      type: 'shell:out',
      data,
      id,
    });
  },
};
