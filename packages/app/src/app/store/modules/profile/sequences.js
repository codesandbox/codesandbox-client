import { set, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

export const loadSandboxes = [
  set(state`profile.isLoadingSandboxes`, true),
  set(state`profile.currentSandboxesPage`, props`page`),
  when(
    state`profile.sandboxes.${state`profile.current.username`}.${props`page`}`
  ),
  {
    true: [],
    false: [actions.getSandboxes, actions.setSandboxes],
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

const shouldGetShowcasedSandbox = when(
  props`profile.showcasedSandboxShortid`,
  state`editor.sandboxes.${props`profile.showcasedSandboxShortid`}`,
  (id, showcasedSandbox) => id && !showcasedSandbox
);

export const loadProfile = [
  set(state`profile.isLoadingProfile`, true),
  set(state`profile.notFound`, false),
  actions.getUser,
  shouldGetShowcasedSandbox,
  {
    true: [
      actions.getShowcasedSandbox,
      set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
    ],
    false: [],
  },
  set(state`profile.profiles.${props`profile.id`}`, props`profile`),
  set(state`profile.currentProfileId`, props`profile.id`),
  set(state`profile.isLoadingProfile`, false),
];
