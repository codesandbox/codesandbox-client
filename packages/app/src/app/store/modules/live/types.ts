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
    selection: UserSelection;
    currentModuleShortid: string;
    color?: number[];
};

export type LiveUser = {
    id: string;
    username: string;
    avatarUrl: string;
};

export type RoomInfo = {
    startTime: number;
    connectionCount: number;
    ownerId: string;
    roomId: string;
    mode: string;
    sandboxId: string;
    editorIds: string[];
    usersMetadata: Dictionary<UserMetadata>;
    users: LiveUser[];
};

export type LiveUserByModule = {
    [moduleId: string]: LiveUser[];
};

export type State = {
    isLive: boolean;
    isLoading: boolean;
    receivingCode: boolean;
    error: string;
    isOwner: boolean;
    reconnecting: boolean;
    roomInfo: RoomInfo;
    isEditor: ComputedValue<boolean>;
    isCurrentEditor: ComputedValue<boolean>;
    liveUsersByModule: ComputedValue<LiveUserByModule>;
};
