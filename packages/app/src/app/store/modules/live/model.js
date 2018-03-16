import { types } from 'mobx-state-tree';

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
