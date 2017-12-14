import { when, set, toggle } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { addNotification } from './factories';

export const loadApp = [
  set(state`isAuthenticating`, true),
  actions.setJwtFromStorage,
  actions.listenToConnectionChange,
  when(state`jwt`),
  {
    true: [
      actions.getUser,
      set(state`user`, props`user`),
      actions.setPatronPrice,
      actions.setStoredSettings,
    ],
    false: [],
  },
  set(state`isAuthenticating`, false),
];

export const unloadApp = actions.stopListeningToConnectionChange;

export const setConnection = set(state`connected`, props`connection`);

export const showAuthenticationError = [];

export const openModal = set(state`currentModal`, props`modal`);

export const closeModal = set(state`currentModal`, null);

export const signIn = [
  set(state`isAuthenticating`, true),
  actions.signInGithub,
  {
    success: [
      actions.getUser,
      set(state`user`, props`user`),
      actions.setPatronPrice,
      actions.setStoredSettings,
    ],
    error: [],
  },
  set(state`currentModal`, null),
  set(state`isAuthenticating`, false),
];
export const signOut = [
  set(state`jwt`, null),
  actions.removeJwtFromStorage,
  set(state`user.id`, null),
  set(state`user.email`, null),
  set(state`user.name`, null),
  set(state`user.username`, null),
  set(state`user.avatarUrl`, null),
  set(state`user.jwt`, null),
  set(state`user.badges`, []),
  set(state`user.integrations`, {}),
];
export const toggleUserMenu = [toggle(state`userMenuOpen`)];
export const removeNotification = actions.removeNotification;

export const getZeitUserDetails = [
  set(state`isLoadingZeit`, true),
  actions.getZeitIntegrationDetails,
  {
    success: [],
    error: [addNotification('Could not authorize with ZEIT', 'error')],
  },
  set(state`isLoadingZeit`, true),
];

export const signInZeit = [
  actions.signInZeit,
  {
    success: [
      set(state`isLoadingZeit`, true),
      set(state`user.integrations.zeit.token`, props`token`),
      actions.updateUserZeitDetails
    ],
    error: [addNotification('Zeit Authentication Error', 'error')],
  },
  set(state`isLoadingZeit`, false),
];

export const signOutZeit = [actions.signOutZeit];
export const getAuthToken = actions.getAuthToken;

export const authorise = [
  actions.getAuthToken,
  {
    success: set(state`authToken`, props`token`),
    error: set(state`editor.error`, props`error.message`),
  },
];

export const signInGithub = [
  set(state`loading`, true),
  actions.signInGithub,
  {
    success: set(state`jwt`, props`jwt`),
    error: addNotification('Github Authentucation Error', 'error'),
  },
  set(state`isLoadingGithub`, false),
];

export const signOutGithub = [actions.signOutGithub, set(state`jwt`, null)];
