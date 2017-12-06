import { types } from 'mobx-state-tree';

export default {
  jwt: types.maybe(types.string),
  user: types.maybe(
    types.model({
      avatarUrl: types.string,
      badges: types.array(
        types.model({
          id: types.string,
          name: types.string,
          visible: types.boolean,
        })
      ),
      email: types.string,
      id: types.string,
      integrations: types.model({
        github: types.maybe(types.model({})),
        zeit: types.maybe(
          types.model({
            token: types.string,
          })
        ),
      }),
      name: types.string,
      subscription: types.maybe(
        types.model({
          amount: types.number,
          since: types.string,
        })
      ),
      username: types.string,
    })
  ),
  connected: types.boolean,
};
