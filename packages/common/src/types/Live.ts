import { Selection } from './Selection';

export type RoomInfo = {
  startTime: number;
  ownerIds: string[];
  roomId: string;
  mode: string;
  chatEnabled: boolean;
  sandboxId: string;
  editorIds: string[];
  users: LiveUser[];
  chat: {
    messages: Array<{
      userId: string;
      date: number;
      message: string;
    }>;
    // We keep a separate map of user_id -> username for the case when
    // a user disconnects. We still need to keep track of the name.
    users: {
      [id: string]: string;
    };
  };
};

export type LiveDisconnectReason = 'close' | 'inactivity';

export type LiveMessage<data = unknown> = {
  event: LiveMessageEvent;
  data: data;
  _isOwnMessage: boolean;
};

export enum LiveMessageEvent {
  JOIN = 'join',
  MODULE_STATE = 'module_state',
  USER_ENTERED = 'user:entered',
  USER_LEFT = 'user:left',
  MODULE_SAVED = 'module:saved',
  MODULE_CREATED = 'module:created',
  MODULE_MASS_CREATED = 'module:mass-created',
  MODULE_UPDATED = 'module:updated',
  MODULE_DELETED = 'module:deleted',
  DIRECTORY_CREATED = 'directory:created',
  DIRECTORY_UPDATED = 'directory:updated',
  DIRECTORY_DELETED = 'directory:deleted',
  USER_SELECTION = 'user:selection',
  USER_CURRENT_MODULE = 'user:current-module',
  LIVE_MODE = 'live:mode',
  LIVE_CHAT_ENABLED = 'live:chat_enabled',
  LIVE_ADD_EDITOR = 'live:add-editor',
  LIVE_REMOVE_EDITOR = 'live:remove-editor',
  OPERATION = 'operation',
  CONNECTION_LOSS = 'connection-loss',
  DISCONNECT = 'disconnect',
  OWNER_LEFT = 'owner_left',
  CHAT = 'chat',
  NOTIFICATION = 'notification',
}

export type LiveUser = {
  username: string;
  selection: Selection;
  id: string;
  currentModuleShortid: string | null;
  color: [number, number, number];
  avatarUrl: string;
};
