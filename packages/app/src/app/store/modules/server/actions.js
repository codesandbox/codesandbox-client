import { dispatch } from 'codesandbox-api';

export function restartSandbox({ executor }) {
  executor.emit('sandbox:restart');
}

export function restartContainer({ executor }) {
  executor.emit('sandbox:restart-container');
}

/**
 * We need to remove this logic later! We need to move it to the terminal component
 * and let that component listen to the executor directly.
 */
export function logSandboxMessage({ props }) {
  dispatch({
    type: 'terminal:message',
    data: props.data.data,
  });
}
