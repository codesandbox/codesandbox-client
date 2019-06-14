import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';

export function restartSandbox({ executor }) {
  executor.emit('sandbox:restart');
}

export function restartContainer({ executor }) {
  executor.emit('sandbox:restart-container');
}

/**
 * TODO: We need to remove this logic later! We need to move it to the terminal component
 * and let that component listen to the executor directly.
 */
export function logSandboxMessage({ props, codeSandboxApi }) {
  codeSandboxApi.dispatch({
    type: 'terminal:message',
    data: props.data.data,
  });
}

export function closeSocket({ executor }) {
  executor.closeExecutor();
}

/**
 * Remove this later when we have a proper API for devtools
 */
export function setupCodeSandboxAPIListener({ codeSandboxApi }) {
  codeSandboxApi.listen('server.onCodeSandboxAPIMessage');
}

export function sendDisconnectedMessage({ codeSandboxApi }) {
  codeSandboxApi.dispatch({ type: 'codesandbox:sse:disconnect' });
}

export function formatErrorMessage({ props }) {
  const { message, unrecoverable } = props.data;

  return {
    error: message,
    unrecoverable,
  };
}

export function showContainerError({ props }) {
  notificationState.addNotification({
    title: `Container Error`,
    message: props.error,
    status: NotificationStatus.ERROR,
  });
}

export function sendShellExit({ props, codeSandboxApi }) {
  const { id, code, signal } = props.data;

  codeSandboxApi.dispatch({
    type: 'shell:exit',
    code,
    signal,
    id,
  });
}

export function sendShellOut({ props, codeSandboxApi }) {
  const { id, data } = props.data;

  codeSandboxApi.dispatch({
    type: 'shell:out',
    data,
    id,
  });
}

export function sendShellMessage({ props, executor }) {
  const { channel, type: _t, codesandbox: _c, ...message } = props.data;
  executor.emit(channel, message);
}
