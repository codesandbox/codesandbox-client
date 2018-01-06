import { sequence } from 'cerebral';
import { when, set, unset } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import * as factories from './factories';

export const unloadApp = actions.stopListeningToConnectionChange;

export const setConnection = set(state`connected`, props`connection`);

export const showAuthenticationError = [];

export const openModal = actions.setModal;

export const closeModal = set(state`currentModal`, null);

export const signOutGithub = [actions.signOutGithub, set(state`jwt`, null)];

export const signOutZeit = [actions.signOutZeit];

export const getAuthToken = actions.getAuthToken;

export const openUserMenu = set(state`userMenuOpen`, true);

export const closeUserMenu = set(state`userMenuOpen`, false);

export const removeNotification = actions.removeNotification;

export const addNotification = factories.addNotification(
  props`message`,
  props`type`
);

export const forkSandbox = sequence('forkSandbox', [
  set(state`editor.isForkingSandbox`, true),
  actions.forkSandbox,
  actions.moveModuleContent,
  set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
  set(state`editor.currentId`, props`sandbox.id`),
  factories.addNotification('Forked sandbox!', 'success'),
  factories.updateSandboxUrl(props`sandbox`),
  set(state`editor.isForkingSandbox`, false),
]);

export const ensureOwnedSandbox = sequence('ensureOwnedSandbox', [
  when(state`editor.currentSandbox.owned`),
  {
    true: [],
    false: forkSandbox,
  },
]);

export const fetchGitChanges = [
  set(state`git.isFetching`, true),
  actions.getGitChanges,
  set(state`git.originalGitChanges`, props`gitChanges`),
  when(props`gitChanges`),
  {
    true: set(state`git.showFetchButton`, false),
    false: set(state`git.showFetchButton`, true),
  },
  set(state`git.isFetching`, false),
];

export const addNpmDependency = [
  set(state`workspace.showSearchDependenciesModal`, false),
  ensureOwnedSandbox,
  actions.optimisticallyAddNpmDependency,
  actions.addNpmDependency,
  {
    success: [],
    error: [
      unset(
        state`editor.sandboxes.${state`editor.currentId`}.npmDependencies.${props`name`}`
      ),
      factories.addNotification('Could not save dependency', 'error'),
    ],
  },
];

export const loadApp = [
  set(state`isAuthenticating`, true),
  actions.setJwtFromStorage,
  actions.listenToConnectionChange,
  when(state`jwt`),
  {
    true: [
      actions.getUser,
      {
        success: [set(state`user`, props`user`), actions.setPatronPrice],
        error: [],
      },
    ],
    false: [],
  },
  actions.setStoredSettings,
  actions.setKeybindings,
  actions.startKeybindings,
  set(state`isAuthenticating`, false),
];

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

export const getZeitUserDetails = [
  when(state`zeitInfo`),
  {
    true: [],
    false: [
      set(state`isLoadingZeit`, true),
      actions.getZeitIntegrationDetails,
      {
        success: set(state`zeitInfo`, props`response.result.user`),
        error: factories.addNotification(
          'Could not authorize with ZEIT',
          'error'
        ),
      },
      set(state`isLoadingZeit`, false),
    ],
  },
];

export const signInZeit = [
  actions.signInZeit,
  {
    success: [
      set(state`isLoadingZeit`, true),
      set(state`user.integrations.zeit.token`, props`token`),
      actions.updateUserZeitDetails,
    ],
    error: factories.addNotification('Zeit Authentication Error', 'error'),
  },
  set(state`isLoadingZeit`, false),
];

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
    error: factories.addNotification('Github Authentucation Error', 'error'),
  },
  set(state`isLoadingGithub`, false),
];

export const loadSandbox = [
  set(state`editor.error`, null),
  when(state`editor.sandboxes.${props`id`}`),
  {
    true: [
      set(state`editor.currentId`, props`id`),
      set(props`sandbox`, state`editor.sandboxes.${props`id`}`),
      actions.setCurrentModuleShortid,
      actions.setMainModuleShortid,
      actions.setInitialTab,
      actions.setUrlOptions,
      actions.setWorkspace,
    ],
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      actions.getSandbox,
      {
        success: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          set(state`editor.currentId`, props`sandbox.id`),
          actions.setCurrentModuleShortid,
          actions.setMainModuleShortid,
          actions.setInitialTab,
          actions.setUrlOptions,
          actions.setWorkspace,
        ],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
      set(state`editor.isLoading`, false),
    ],
  },
];
