import { when, set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

export const loadApp = [
  actions.setJwtFromStorage,
  actions.listenToConnectionChange,
  when(state`jwt`),
  {
    true: [
      actions.getUser,
      set(state`user`, props`user`),
      actions.setPatronPrice,
    ],
    false: [],
  },
];

export const unloadApp = actions.stopListeningToConnectionChange;

export const setConnection = set(state`connected`, props`connection`);

export const showAuthenticationError = [];

export const openModal = set(state`currentModal`, props`modal`);

export const closeModal = set(state`currentModal`, null);

export const signIn = [];

export const removeNotification = actions.removeNotification;
