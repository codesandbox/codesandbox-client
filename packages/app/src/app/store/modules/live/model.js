import { types } from 'mobx-state-tree';

const Selection = types.model({
  selection: types.array(types.number),
  cursorPosition: types.number,
});

export const UserSelection = types.model({
  primary: Selection,
  secondary: types.array(Selection),
});

const UserMetadata = types.model({
  selection: types.maybe(UserSelection),
  currentModuleShortid: types.string,
  color: types.array(types.number),
});

export default {
  isLive: types.boolean,
  isLoading: types.boolean,
  receivingCode: types.boolean,
  error: types.maybe(types.string),
  isOwner: types.boolean,
  reconnecting: types.boolean,
  notificationsHidden: types.boolean,
  followingUserId: types.maybe(types.string),
  roomInfo: types.maybe(
    types.model({
      startTime: types.maybe(types.number),
      connectionCount: types.number,
      ownerId: types.string,
      roomId: types.string,
      mode: types.string,
      chatEnabled: types.boolean,
      sandboxId: types.string,
      editorIds: types.array(types.string),
      usersMetadata: types.map(UserMetadata),
      version: types.string,
      users: types.array(
        types.model({
          id: types.string,
          username: types.string,
          avatarUrl: types.string,
        })
      ),
      chat: types.model({
        messages: types.array(
          types.model({
            userId: types.string,
            date: types.number,
            message: types.string,
          })
        ),
        // We keep a separate map if user_id -> username for the case when
        // a user disconnects. We still need to keep track of the name.
        users: types.map(types.string),
      }),
    })
  ),
};
