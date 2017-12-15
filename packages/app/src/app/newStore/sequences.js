import { when, set } from 'cerebral/operators';
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

export const signIn = [];

export const removeNotification = actions.removeNotification;

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
  actions.siginInGithub,
  {
    success: set(state`jwt`, props`jwt`),
    error: addNotification('Github Authentucation Error', 'error'),
  },
  set(state`isLoadingGithub`, false),
];

export const signOutGithub = [actions.signOutGithub, set(state`jwt`, null)];
