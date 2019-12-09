import {
  ServerStatus,
  ServerContainerStatus,
  ServerPort,
} from '@codesandbox/common/lib/types';

type State = {
  status: ServerStatus;
  containerStatus: ServerContainerStatus;
  error: string;
  hasUnrecoverableError: false;
  ports: ServerPort[];
};

export const state: State = {
  status: ServerStatus.INITIALIZING,
  containerStatus: ServerContainerStatus.INITIALIZING,
  error: null,
  hasUnrecoverableError: false,
  ports: [],
};
