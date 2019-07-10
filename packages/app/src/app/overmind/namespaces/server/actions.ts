import { Action } from 'app/overmind';
import {
  ServerStatus,
  ServerContainerStatus,
} from '@codesandbox/common/lib/types';

export const statusChanged: Action<ServerStatus> = ({ state }, status) => {
  state.server.status = status;
};

export const containerStatusChanged: Action<ServerContainerStatus> = (
  { state },
  status
) => {
  state.server.containerStatus = status;
};
