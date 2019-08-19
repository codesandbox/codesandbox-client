import {
  ServerStatus,
  ServerContainerStatus,
} from '@codesandbox/common/lib/types';

type State = {
  status: ServerStatus;
  containerStatus: ServerContainerStatus;
  error: string;
  hasUnrecoverableError: false;
  ports: any[];
};

export const state: State = {
  status: ServerStatus.INITIALIZING,
  containerStatus: ServerContainerStatus.INITIALIZING,
  error: null,
  hasUnrecoverableError: false,
  ports: [],
};
