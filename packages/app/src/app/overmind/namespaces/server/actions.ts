import { ViewTab } from '@codesandbox/common/lib/templates/template';
import {
  Sandbox,
  ServerContainerStatus,
  ServerPort,
  ServerStatus,
} from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { Context } from 'app/overmind';
import { getDevToolsTabPosition } from 'app/overmind/utils/server';

export const restartSandbox = ({ effects }: Context) => {
  effects.executor.emit('sandbox:restart');
};

export const restartContainer = ({ effects, state }: Context) => {
  state.server.containerStatus = ServerContainerStatus.INITIALIZING;
  effects.executor.emit('sandbox:restart-container');
};

export const statusChanged = ({ state }: Context, status: ServerStatus) => {
  state.server.status = status;
};

export const containerStatusChanged = (
  { state }: Context,
  status: ServerContainerStatus
) => {
  state.server.containerStatus = status;
};

export const onSSEMessage = (
  { state: { server, editor }, effects, actions }: Context,
  {
    event,
    data,
  }: {
    event: string;
    data: any;
  }
) => {
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
      const newPorts = data as ServerPort[];
      const currentPorts = server.ports;
      const removedPorts = currentPorts.filter(
        port => !newPorts.find(p => p.port === port.port)
      );
      const addedPorts = newPorts.filter(
        port => !currentPorts.find(p => p.port === port.port)
      );
      const openedPorts: number[] = [];

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

      addedPorts.forEach(port => {
        if (!port.main && openedPorts.indexOf(port.port) === -1) {
          effects.notificationToast.add({
            title: `Port ${port.port} Opened`,
            message: `The server is listening on port ${port.port}, do you want to open it?`,
            status: NotificationStatus.NOTICE,
            actions: {
              primary: {
                label: 'Open Browser Pane',
                run: () => actions.server.onBrowserFromPortOpened(port),
              },
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
      } else if (!error.includes('is larger than maximum size')) {
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

export const onCodeSandboxAPIMessage = (
  { effects }: Context,
  {
    data,
  }: {
    data: any;
  }
) => {
  if (data.type === 'socket:message') {
    const { channel, type: _t, codesandbox: _c, ...message } = data;
    effects.executor.emit(channel, message);
  }
};

type BrowserOptions = { title?: string; url?: string } & (
  | { port: number }
  | { url: string }
);
export const onBrowserTabOpened = (
  { actions, state }: Context,
  {
    closeable,
    options,
  }: {
    closeable?: boolean;
    options?: BrowserOptions;
  }
) => {
  const tab: ViewTab = {
    id: 'codesandbox.browser',
  };

  if (typeof options !== 'undefined') {
    tab.options = options;
  }

  if (typeof closeable !== 'undefined') {
    tab.closeable = closeable;
  }

  const position = getDevToolsTabPosition({
    tabs: state.editor.devToolTabs,
    tab,
  });

  if (position) {
    actions.editor.onDevToolsPositionChanged({ position });
  } else {
    actions.editor.onDevToolsTabAdded({ tab });
  }
};

export const onBrowserFromPortOpened = (
  { actions }: Context,
  { main, port }: ServerPort
) => {
  if (main) {
    actions.server.onBrowserTabOpened({});
  } else {
    actions.server.onBrowserTabOpened({
      closeable: true,
      options: {
        port,
      },
    });
  }
};

export const startContainer = async (
  { effects, actions }: Context,
  sandbox: Sandbox
) => {
  await effects.executor.initializeExecutor(sandbox);

  [
    'connect',
    'disconnect',
    'sandbox:status',
    'sandbox:start',
    'sandbox:stop',
    'sandbox:error',
    'sandbox:log',
    'sandbox:hibernate',
    'sandbox:update',
    'sandbox:port',
    'shell:out',
    'shell:exit',
  ].forEach(message => {
    effects.executor.listen(message, actions.server.onSSEMessage);
  });

  await effects.executor.setupExecutor();
};
