import { RoomInfo } from '@codesandbox/common/lib/types';

type State = {
  isLive: boolean;
  isTeam: boolean;
  isLoading: boolean;
  error: string;
  roomInfo: RoomInfo;
  liveUserId: string;
  receivingCode: boolean;
};

export const state: State = {
  isLive: false,
  isTeam: false,
  isLoading: false,
  error: null,
  roomInfo: null,
  liveUserId: null,
  receivingCode: false,
};
