import {
  ServerStatus,
  ServerContainerStatus,
} from '@codesandbox/common/lib/types';

type State = {
  status: ServerStatus;
  containerStatus: ServerContainerStatus;
};

export const state: State = {
  status: ServerStatus.INITIALIZING,
  containerStatus: ServerContainerStatus.INITIALIZING,
};
