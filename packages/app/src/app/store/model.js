import { types } from 'mobx-state-tree';

export default {
  hasLoadedApp: types.boolean,
  jwt: types.maybe(types.string),
  isAuthenticating: types.boolean,
  userMenuOpen: types.boolean,
  authToken: types.maybe(types.string),
  error: types.maybe(types.string),
  user: types.maybe(
    types.model({
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
            email: types.maybe(types.string),
          })
        ),
        zeit: types.maybe(
          types.model({
            email: types.maybe(types.string),
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
    })
  ),
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
  contextMenu: types.model({
    show: types.boolean,
    items: types.array(types.string),
    x: types.number,
    y: types.number,
  }),
  currentModal: types.maybe(types.string),
  uploadedFiles: types.maybe(
    types.array(
      types.model({
        id: types.identifier(),
        url: types.string,
        objectSize: types.number,
        name: types.string,
        path: types.string,
      })
    )
  ),
  maxStorage: types.number,
  usedStorage: types.number,
  updateStatus: types.maybe(types.string),
};
