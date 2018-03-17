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
  selections: types.map(UserSelection),
  color: types.array(types.number),
});

export default {
  isLive: types.boolean,
  isLoading: types.boolean,
  receivingCode: types.boolean,
  error: types.maybe(types.string),
  isOwner: types.boolean,
  roomInfo: types.maybe(
    types.model({
      roomId: types.string,
      sandboxId: types.string,
      editorUserId: types.string,
      usersMetadata: types.map(UserMetadata),
      users: types.array(
        types.model({
          id: types.string,
          username: types.string,
          avatarUrl: types.string,
        })
      ),
    })
  ),
};
