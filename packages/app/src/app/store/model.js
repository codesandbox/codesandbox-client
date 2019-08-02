import { types } from 'mobx-state-tree';

export default {
  hasLoadedApp: types.boolean,
  jwt: types.maybeNull(types.string),
  isAuthenticating: types.boolean,
  userMenuOpen: types.boolean,
  authToken: types.maybeNull(types.string),
  error: types.maybeNull(types.string),
  contributors: types.array(types.string),
  user: types.maybeNull(
    types.model({
      avatarUrl: types.maybeNull(types.string),
      badges: types.array(
        types.model({
          id: types.string,
          name: types.string,
          visible: types.boolean,
        })
      ),
      curatorAt: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      id: types.maybeNull(types.string),
      integrations: types.model({
        github: types.maybeNull(
          types.model({
            email: types.maybeNull(types.string),
          })
        ),
        zeit: types.maybeNull(
          types.model({
            email: types.maybeNull(types.string),
            token: types.string,
          })
        ),
      }),
      name: types.maybeNull(types.string),
      subscription: types.maybeNull(
        types.model({
          amount: types.number,
          since: types.string,
          cancelAtPeriodEnd: types.maybeNull(types.boolean),
        })
      ),
      username: types.maybeNull(types.string),
      sendSurvey: types.maybeNull(types.boolean),
    })
  ),
  connected: types.boolean,
  isLoadingCLI: types.boolean,
  isLoadingGithub: types.boolean,
  isLoadingZeit: types.boolean,
  contextMenu: types.model({
    show: types.boolean,
    items: types.array(types.string),
    x: types.number,
    y: types.number,
  }),
  currentModal: types.maybeNull(types.string),
  currentModalMessage: types.maybeNull(types.string),
  uploadedFiles: types.maybeNull(
    types.array(
      types.model({
        id: types.identifier,
        url: types.string,
        objectSize: types.number,
        name: types.string,
        path: types.string,
      })
    )
  ),
  maxStorage: types.number,
  usedStorage: types.number,
  updateStatus: types.maybeNull(types.string),
};
