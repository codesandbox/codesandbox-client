import { Dictionary, ComputedValue } from '@cerebral/fluent';

export type Selection = {
  selection: number[];
  cursorPosition: number;
};

export type UserSelection = {
  primary: Selection;
  secondary: Selection[];
};

export type UserMetadata = {
  selection: UserSelection | undefined;
  currentModuleShortid: string;
  color: number[] | undefined;
};

export type LiveUser = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type LiveMessage = {
  userId: string;
  date: number;
  message: string;
};

export type RoomInfo = {
  startTime: number | undefined;
  connectionCount: number;
  ownerId: string;
  roomId: string;
  mode: string;
  sandboxId: string;
  editorIds: string[];
  usersMetadata: Dictionary<UserMetadata>;
  users: LiveUser[];
  chatEnabled: boolean;
  chat: {
    messages: LiveMessage[];
    // We keep a separate map if user_id -> username for the case when
    // a user disconnects. We still need to keep track of the name.
    users: string[];
  };
};

export type LiveUserByModule = {
  [moduleId: string]: string[];
};

export type State = {
  isLive: boolean;
  isLoading: boolean;
  receivingCode: boolean;
  error: string | undefined;
  isOwner: boolean;
  reconnecting: boolean;
  notificationsHidden: boolean;
  followingUserId: string | null;
  roomInfo: RoomInfo;
  isEditor: (userId: string) => boolean;
  isCurrentEditor: ComputedValue<boolean>;
  liveUsersByModule: ComputedValue<LiveUserByModule>;
};
