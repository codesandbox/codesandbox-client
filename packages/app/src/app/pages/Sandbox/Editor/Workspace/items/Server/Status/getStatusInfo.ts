import {
  SSEContainerStatus,
  SSEManagerStatus,
} from '@codesandbox/common/lib/types';

const STATUS_COLORS = {
  disconnected: '#FD2439',
  connected: '#4CFF00',
  initializing: '#FFD399',
  hibernated: '#FF662E',
  error: '#FD2439',
};
const STATUS_MESSAGES = {
  initializing: 'Container is starting...',
  starting: 'Sandbox is starting...',
  started: 'Connected to sandbox',
  error: 'A sandbox error occurred',
  hibernated: 'Sandbox hibernated',
};

export const getContainerStatusInfo = (status: SSEContainerStatus) => {
  const containerStatuses = {
    'container-started': {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.starting,
    },
    error: { color: STATUS_COLORS.error, message: STATUS_MESSAGES.error },
    hibernated: {
      color: STATUS_COLORS.hibernated,
      message: STATUS_MESSAGES.hibernated,
    },
    initializing: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.initializing,
    },
    'sandbox-started': {
      color: STATUS_COLORS.connected,
      message: STATUS_MESSAGES.started,
    },
    stopped: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.starting,
    },
  };

  return containerStatuses[status];
};

export const getManagerStatusInfo = (status: SSEManagerStatus) => {
  const managerStatuses = {
    connected: undefined,
    disconnected: undefined,
    initializing: {
      color: STATUS_COLORS.initializing,
      message: STATUS_MESSAGES.initializing,
    },
  };

  return managerStatuses[status];
};
