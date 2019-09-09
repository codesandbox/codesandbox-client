// @ts-check
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';

import { ViewConfig } from '@codesandbox/common/lib/templates/template';

import { INITIAL_SERVER_STATE } from './state';

export function resetServerState({ state }) {
  state.set('server', INITIAL_SERVER_STATE);
}

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
  if (props.unrecoverable) {
    notificationState.addNotification({
      title: `Container Error`,
      message: props.error,
      status: NotificationStatus.ERROR,
    });
  } else {
    notificationState.addNotification({
      title: `Container Warning`,
      message: props.error,
      status: NotificationStatus.WARNING,
    });
  }
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

export function setPorts({ props, state }) {
  state.set('server.ports', props.data);
}

export function openBrowserFromPort({ controller, props }) {
  controller.getSignal('editor.openDevToolsTab')({
    tab: props.port.main
      ? { id: 'codesandbox.browser' }
      : {
          id: 'codesandbox.browser',
          closeable: true,
          options: {
            port: props.port.port,
            url: `https://${props.port.hostname}`,
          },
        },
  });
}

export function showPortClosedNotifications({ state, props }) {
  const currentPorts = state.get('server.ports');

  const removedPorts = currentPorts.filter(
    port => !props.ports.find(p => p.port === port.port)
  );

  const getClosedMessage = () => {
    if (removedPorts.length === 1) {
      return `Port ${removedPorts[0].port} closed`;
    }

    return `The following ports closed: ${removedPorts
      .map(p => p.port)
      .join(', ')}`;
  };

  if (removedPorts.length > 0) {
    notificationState.addNotification({
      title: `Server Ports Closed`,
      message: getClosedMessage(),
      status: NotificationStatus.NOTICE,
    });
  }
}

function getOpenedBrowserPorts(views: ViewConfig[]) {
  const ports = [];

  views.forEach(view => {
    view.views.forEach(tab => {
      if (tab.id === 'codesandbox.browser' && tab.options && tab.options.port) {
        ports.push(tab.options.port);
      }
    });
  });

  return ports;
}

export function showPortOpenedNotifications({ state, props, controller }) {
  const currentPorts = state.get('server.ports');
  const newPorts = props.ports;
  const template = state.get('editor.currentSandbox.template');

  const addedPorts = newPorts.filter(
    port => !currentPorts.find(p => p.port === port.port)
  );
  const openedPorts = getOpenedBrowserPorts(state.get('editor.devToolTabs'));
  if (template === 'gatsby') {
    const mainPort = addedPorts.find(port => port.main);
    openBrowserFromPort({
      props: {
        port: {
          ...mainPort,
          main: false,
          hostname: mainPort.hostname + '/___graphql',
        },
      },
      controller,
    });
  }

  addedPorts.forEach(port => {
    if (!(port.main || openedPorts.includes(port.port))) {
      notificationState.addNotification({
        title: `Port ${port.port} Opened`,
        message: `The server is listening on port ${
          port.port
        }, do you want to open it?`,
        status: NotificationStatus.NOTICE,
        actions: {
          primary: [
            {
              label: 'Open Browser Pane',
              run: () => {
                openBrowserFromPort({ props: { port }, controller });
              },
            },
          ],
        },
      });
    }
  });
}
