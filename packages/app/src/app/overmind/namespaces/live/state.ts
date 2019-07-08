import { RoomInfo, User } from '@codesandbox/common/lib/types';
import { Derive } from 'app/overmind';

type State = {
  isLive: boolean;
  isTeam: boolean;
  isLoading: boolean;
  receivingCode: boolean;
  error: string;
  reconnecting: boolean;
  notificationsHidden: boolean;
  followingUserId: string;
  liveUserId: string;
  roomInfo: RoomInfo;
  liveUser: Derive<State, User>;
  isEditor: Derive<State, (liveUserId: string) => boolean>;
  isCurrentEditor: Derive<State, boolean>;
  isOwner: Derive<State, boolean>;
  liveUsersByModule: Derive<
    State,
    {
      [id: string]: string[];
    }
  >;
};

export const state: State = {
  isLive: false,
  isTeam: false,
  isLoading: false,
  receivingCode: false,
  reconnecting: false,
  notificationsHidden: false,
  followingUserId: null,
  error: null,
  liveUserId: null,
  roomInfo: null,
  liveUser: state => {
    return (
      state.roomInfo &&
      state.roomInfo.users.find(u => u.id === state.liveUserId)
    );
  },
  isEditor: state => liveUserId => {
    return (
      state.isLive &&
      (state.roomInfo.mode === 'open' ||
        state.roomInfo.ownerIds.indexOf(liveUserId) > -1 ||
        state.roomInfo.editorIds.indexOf(liveUserId) > -1)
    );
  },
  isCurrentEditor: state => {
    return state.isEditor(state.liveUserId);
  },

  isOwner: state => {
    return (
      state.isLive && state.roomInfo.ownerIds.indexOf(state.liveUserId) > -1
    );
  },
  liveUsersByModule: state => {
    const usersByModule = {};

    if (!state.isLive || !state.roomInfo) {
      return {};
    }

    const liveUserId = state.liveUserId;

    state.roomInfo.users.forEach(user => {
      const userId = user.id;
      if (userId !== liveUserId) {
        usersByModule[user.currentModuleShortid] =
          usersByModule[user.currentModuleShortid] || [];
        usersByModule[user.currentModuleShortid].push(user.color);
      }
    });

    return usersByModule;
  },
};
