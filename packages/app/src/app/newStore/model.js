import { types } from 'mobx-state-tree';

export default {
  jwt: types.maybe(types.string),
  isAuthenticating: types.boolean,
  userMenuOpen: types.boolean,
  authToken: types.maybe(types.string),
  error: types.maybe(types.string),
  user: types.model({
    avatarUrl: types.maybe(types.string),
    badges: types.array(
      types.model({
        id: types.string,
        name: types.string,
        visible: types.boolean,
      })
    ),
    email: types.maybe(types.string),
    id: types.maybe(types.string),
    integrations: types.model({
      github: types.maybe(
        types.model({
          email: types.string,
        })
      ),
      zeit: types.maybe(
        types.model({
          token: types.string,
        })
      ),
    }),
    name: types.maybe(types.string),
    subscription: types.maybe(
      types.model({
        amount: types.number,
        since: types.string,
      })
    ),
    username: types.maybe(types.string),
  }),
  connected: types.boolean,
  notifications: types.array(
    types.model({
      buttons: types.array(types.string),
      endTime: types.number,
      id: types.number,
      notificationType: types.string,
      title: types.string,
    })
  ),
  isLoadingCLI: types.boolean,
  isLoadingGithub: types.boolean,
  isLoadingZeit: types.boolean,
  zeitInfo: types.maybe(
    types.model({
      avatar: types.maybe(types.string),
      billingChecked: types.boolean,
      date: types.maybe(types.string),
      email: types.string,
      uid: types.string,
      username: types.maybe(types.string),
    })
  ),
};
