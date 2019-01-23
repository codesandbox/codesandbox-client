import { sequence, parallel } from 'cerebral';
import { set, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { withLoadApp } from '../../factories';

const shouldGetShowcasedSandbox = when(
  state`profile.current.showcasedSandboxShortid`,
  state`editor.sandboxes.${state`profile.current.showcasedSandboxShortid`}`,
  (id, showcasedSandbox) => id && !showcasedSandbox
);

const getShowcasedSandbox = sequence('getShowcasedSandbox', [
  shouldGetShowcasedSandbox,
  {
    true: [
      actions.getShowcasedSandbox,
      set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
    ],
    false: [],
  },
]);

export const showDeleteSandboxModal = [
  set(state`profile.sandboxToDeleteId`, props`id`),
  set(state`currentModal`, 'deleteProfileSandbox'),
];

export const openSelectSandboxModal = [
  set(state`currentModal`, 'selectSandbox'),
  when(state`profile.userSandboxes`, sandboxes => sandboxes.length),
  {
    true: [],
    false: [
      set(state`profile.isLoadingSandboxes`, true),
      actions.getAllUserSandboxes,
      set(state`profile.userSandboxes`, props`sandboxes`),
      set(state`profile.isLoadingSandboxes`, false),
    ],
  },
];

export const loadProfile = withLoadApp([
  set(state`profile.isLoadingProfile`, true),
  set(state`profile.notFound`, false),
  actions.getUser,
  set(state`profile.profiles.${props`profile.id`}`, props`profile`),
  set(state`profile.currentProfileId`, props`profile.id`),
  getShowcasedSandbox,
  set(state`profile.isLoadingProfile`, false),
]);

export const setNewSandboxShowcase = [
  set(state`profile.showSelectSandboxModal`, false),
  set(
    state`profile.profiles.${state`profile.currentProfileId`}.showcasedSandboxShortid`,
    props`id`
  ),
  set(state`profile.isLoadingProfile`, true),
  parallel([getShowcasedSandbox, actions.saveShowcasedSandbox]),
  set(state`profile.isLoadingProfile`, false),
];

export const loadSandboxes = [
  set(state`profile.isLoadingSandboxes`, true),
  set(state`profile.currentSandboxesPage`, props`page`),
  when(
    state`profile.sandboxes.${state`profile.current.username`}.${props`page`}`,
    props`force`,
    (sandboxes, force) => !sandboxes || force
  ),
  {
    true: [actions.getSandboxes, actions.setSandboxes],
    false: [],
  },
  set(state`profile.isLoadingSandboxes`, false),
];

export const loadLikedSandboxes = [
  set(state`profile.isLoadingSandboxes`, true),
  set(state`profile.currentLikedSandboxesPage`, props`page`),
  when(
    state`profile.likedSandboxes.${state`profile.current.username`}.${props`page`}`
  ),
  {
    true: [],
    false: [actions.getLikedSandboxes, actions.setLikedSandboxes],
  },
  set(state`profile.isLoadingSandboxes`, false),
];

export const deleteSandbox = [
  set(props`sandboxToDeleteIndex`, state`profile.sandboxToDeleteIndex`),
  set(state`profile.isLoadingSandboxes`, true),
  set(state`currentModal`, null),
  actions.deleteSandbox,
  set(state`profile.sandboxToDeleteId`, null),
  set(props`page`, state`profile.currentSandboxesPage`),
  set(props`force`, true),
  loadSandboxes,
];
