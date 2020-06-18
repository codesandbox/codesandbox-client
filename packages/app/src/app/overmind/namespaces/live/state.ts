import {
  LiveUser,
  RoomInfo,
  UserSelection,
  UserViewRange,
} from '@codesandbox/common/lib/types';
import { derived } from 'overmind';

type State = {
  isLive: boolean;
  isTeam: boolean;
  isLoading: boolean;
  error: string | null;
  reconnecting: boolean;
  notificationsHidden: boolean;
  followingUserId: string | null;
  liveUserId: string | null;
  roomInfo: RoomInfo | null;
  /**
   * Whether we joined from /s/ or from /live/
   */
  joinSource: 'sandbox' | 'live';
  currentSelection: UserSelection | null;
  currentViewRange: UserViewRange | null;
  liveUser: LiveUser | null;
  isEditor: (liveUserId: string) => boolean;
  isCurrentEditor: boolean;
  isOwner: boolean;
  liveUsersByModule: {
    [id: string]: number[][];
  };
};

export const state: State = {
  isLive: false,
  isTeam: false,
  isLoading: false,
  reconnecting: false,
  notificationsHidden: false,
  followingUserId: null,
  error: null,
  liveUserId: null,
  roomInfo: null,
  currentSelection: {
    primary: {
      cursorPosition: 0,
      selection: [],
    },
    secondary: [],
    source: 'overmind',
  },
  currentViewRange: null,
  joinSource: 'sandbox',
  liveUser: derived(
    (currentState: State) =>
      currentState.roomInfo?.users.find(
        u => u.id === currentState.liveUserId
      ) || null
  ),
  isEditor: derived((currentState: State) => liveUserId =>
    Boolean(
      currentState.isLive &&
        currentState.roomInfo &&
        (currentState.roomInfo.mode === 'open' ||
          currentState.roomInfo.ownerIds.includes(liveUserId) ||
          currentState.roomInfo.editorIds.includes(liveUserId))
    )
  ),
  isCurrentEditor: derived((currentState: State) =>
    Boolean(
      currentState.liveUserId && currentState.isEditor(currentState.liveUserId)
    )
  ),
  isOwner: derived((currentState: State) =>
    Boolean(
      currentState.isLive &&
        currentState.liveUserId &&
        currentState.roomInfo?.ownerIds.includes(currentState.liveUserId)
    )
  ),
  liveUsersByModule: derived((currentState: State) => {
    const usersByModule: { [id: string]: number[][] } = {};

    if (!currentState.isLive || !currentState.roomInfo) {
      return {};
    }

    const { liveUserId } = currentState;

    currentState.roomInfo.users.forEach(user => {
      const userId = user.id;
      if (user && userId !== liveUserId && user.currentModuleShortid) {
        usersByModule[user.currentModuleShortid] =
          usersByModule[user.currentModuleShortid] || [];
        usersByModule[user.currentModuleShortid].push(user.color);
      }
    });

    return usersByModule;
  }),
};
