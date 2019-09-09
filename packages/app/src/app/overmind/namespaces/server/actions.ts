import { Action } from 'app/overmind';
import {
  ServerStatus,
  ServerContainerStatus,
} from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { host } from '@codesandbox/common/lib/utils/url-generator';

export const restartSandbox: Action = ({ effects }) => {
  effects.executor.emit('sandbox:restart');
};

export const restartContainer: Action = ({ state, effects }) => {
  state.server.containerStatus = ServerContainerStatus.INITIALIZING;
  effects.executor.emit('sandbox:restart-container');
};

export const statusChanged: Action<ServerStatus> = ({ state }, status) => {
  state.server.status = status;
};

export const containerStatusChanged: Action<ServerContainerStatus> = (
  { state },
  status
) => {
  state.server.containerStatus = status;
};

export const onSSEMessage: Action<{
  event: string;
  data: any;
}> = ({ state: { server, editor }, effects, actions }, { event, data }) => {
  switch (event) {
    case 'connect':
      server.error = null;
      server.status = ServerStatus.CONNECTED;
      break;
    case 'disconnect':
      if (
        server.containerStatus !== ServerContainerStatus.HIBERNATED &&
        server.status === ServerStatus.CONNECTED
      ) {
        server.status = ServerStatus.DISCONNECTED;
        effects.codesandboxApi.disconnectSSE();
      }
      break;
    case 'sandbox:start':
      server.containerStatus = ServerContainerStatus.SANDBOX_STARTED;
      break;
    case 'sandbox:stop':
      if (server.containerStatus !== ServerContainerStatus.HIBERNATED) {
        server.containerStatus = ServerContainerStatus.STOPPED;
      }
      break;
    case 'sandbox:update':
      actions.files.syncSandbox(data.updates);
      break;
    case 'sandbox:hibernate':
      server.containerStatus = ServerContainerStatus.HIBERNATED;
      effects.executor.closeExecutor();
      break;
    case 'sandbox:status':
      if (data.status === 'starting-container') {
        server.containerStatus = ServerContainerStatus.INITIALIZING;
      } else if (data.status === 'installing-packages') {
        server.containerStatus = ServerContainerStatus.CONTAINER_STARTED;
      }
      break;
    case 'sandbox:log':
      effects.codesandboxApi.logTerminalMessage(data.data);
      break;
    case 'sandbox:port': {
      const newPorts = data;
      const currentPorts = server.ports;
      const removedPorts = currentPorts.filter(
        port => !newPorts.find(p => p.port === port.port)
      );
      const addedPorts = newPorts.filter(
        port => !currentPorts.find(p => p.port === port.port)
      );
      const openedPorts = [];

      if (removedPorts.length > 0) {
        effects.notificationToast.add({
          title: `Server Ports Closed`,
          message:
            removedPorts.length === 1
              ? `Port ${removedPorts[0].port} closed`
              : `The following ports closed: ${removedPorts
                  .map(p => p.port)
                  .join(', ')}`,
          status: NotificationStatus.NOTICE,
        });
      }

      editor.devToolTabs.forEach(view => {
        view.views.forEach(tab => {
          if (
            tab.id === 'codesandbox.browser' &&
            tab.options &&
            tab.options.port
          ) {
            openedPorts.push(tab.options.port);
          }
        });
      });
      const browserTabs = editor.devToolTabs.find(view =>
        view.views.find(tab => tab.id === 'codesandbox.browser')
      ).views;

      if (
        editor.currentSandbox.template === 'gatsby' &&
        !browserTabs.find(tab => (tab.options || {}).url.contains('___graphql'))
      ) {
        const hostname = `https://${editor.currentSandbox.id}.sse.${
          process.env.NODE_ENV === 'development' || process.env.STAGING
            ? 'codesandbox.io'
            : host()
        }/___graphql`;

        editor.currentDevToolsPosition = {
          devToolIndex: 0,
          tabPosition: 0,
        };
        actions.server.onBrowserFromPortOpened({
          port: {
            main: false,
            port: 8080,
            hostname,
          },
        });
      }

      addedPorts.forEach(port => {
        if (!port.main && openedPorts.indexOf(port.port) === -1) {
          effects.notificationToast.add({
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
                    actions.server.onBrowserFromPortOpened({ port });
                  },
                },
              ],
            },
          });
        }
      });

      server.ports = newPorts;

      break;
    }
    case 'sandbox:error': {
      const { message: error, unrecoverable } = data;

      server.hasUnrecoverableError = unrecoverable;
      server.error = error;

      if (unrecoverable) {
        effects.notificationToast.add({
          title: `Container Error`,
          message: error,
          status: NotificationStatus.ERROR,
        });
        effects.executor.closeExecutor();
      } else {
        effects.notificationToast.add({
          title: `Container Warning`,
          message: error,
          status: NotificationStatus.WARNING,
        });
      }

      break;
    }
    case 'shell:exit':
      effects.codesandboxApi.exitShell(data);
      break;
    case 'shell:out':
      effects.codesandboxApi.outShell(data);
      break;
  }
};

export const onCodeSandboxAPIMessage: Action<{
  data: any;
}> = ({ effects }, { data }) => {
  if (data.type === 'socket:message') {
    const { channel, type: _t, codesandbox: _c, ...message } = data;
    effects.executor.emit(channel, message);
  }
};

export const onBrowserFromPortOpened: Action<{
  port: any;
}> = ({ actions }, { port }) => {
  actions.editor.onDevToolsTabAdded({
    tab: port.main
      ? { id: 'codesandbox.browser' }
      : {
          id: 'codesandbox.browser',
          closeable: true,
          options: {
            port: port.port,
            url: `https://${port.hostname}`,
          },
        },
  });
};
