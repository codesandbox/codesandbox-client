import { sequence } from 'cerebral';
import { when, push, set, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import * as factories from './factories';

import {
  saveNewModule,
  createOptimisticModule,
  updateOptimisticModule,
  removeOptimisticModule,
} from './modules/files/actions';

export const unloadApp = actions.stopListeningToConnectionChange;

export const setConnection = set(state`connected`, props`connection`);

export const showAuthenticationError = [];

export const openModal = actions.setModal;

const whenPackageJSONExists = when(props`sandbox.modules`, modules =>
  modules.find(m => m.directoryShortid == null && m.title === 'package.json')
);

export const ensurePackageJSON = [
  when(props`sandbox.owned`),
  {
    true: [
      whenPackageJSONExists,
      {
        true: [],
        false: [
          set(props`backupTitle`, props`title`),
          set(props`backupCode`, props`newCode`),
          set(props`backupModuleShortid`, props`moduleShortid`),
          set(props`backupDirectoryShortid`, props`directoryShortid`),
          actions.createPackageJSON,
          // TODO deduplicate this from files/sequences.js. There was a circular dependency problem
          createOptimisticModule,
          push(
            state`editor.sandboxes.${state`editor.currentId`}.modules`,
            props`optimisticModule`
          ),
          saveNewModule,
          {
            success: [updateOptimisticModule],
            error: [removeOptimisticModule],
          },
          set(props`title`, props`backupTitle`),
          set(props`newCode`, props`backupCode`),
          set(props`moduleShortid`, props`backupModuleShortid`),
          set(props`directoryShortid`, props`backupDirectoryShortid`),
        ],
      },
    ],
    false: [],
  },
];

export const closeModal = [
  equals(state`currentModal`),
  {
    preferences: [
      equals(state`preferences.itemId`),
      {
        keybindings: [
          when(props`isKeyDown`),
          {
            true: [],
            false: [set(state`currentModal`, null), actions.startKeybindings],
          },
        ],
        otherwise: [set(state`currentModal`, null), actions.startKeybindings],
      },
    ],
    otherwise: set(state`currentModal`, null),
  },
];

export const signOutZeit = [
  actions.signOutZeit,
  set(state`user.integrations.zeit`, null),
];

export const signOutGithubIntegration = [
  actions.signOutGithubIntegration,
  set(state`user.integrations.github`, null),
];

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
  ensurePackageJSON,
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
  set(state`git.isFetching`, false),
];

export const signIn = [
  set(state`isAuthenticating`, true),
  actions.signInGithub,
  {
    success: [
      actions.setJwtFromProps,
      actions.getUser,
      {
        success: [
          set(state`user`, props`user`),
          actions.setPatronPrice,
          actions.setStoredSettings,
        ],
        error: [
          factories.addNotification('Github Authentication Error', 'error'),
        ],
      },
    ],
    error: [],
  },
  set(state`currentModal`, null),
  set(state`isAuthenticating`, false),
];

export const signOut = [
  actions.signOut,
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
  when(state`user.integrations.zeit`, val => val && val.token && !val.email),
  {
    true: [
      set(state`isLoadingZeit`, true),
      actions.getZeitIntegrationDetails,
      {
        success: set(
          state`user.integrations.zeit.email`,
          props`response.user.email`
        ),
        error: factories.addNotification(
          'Could not authorize with ZEIT',
          'error'
        ),
      },
      set(state`isLoadingZeit`, false),
    ],
    false: [],
  },
];

export const signInZeit = [
  set(state`isLoadingZeit`, true),
  actions.signInZeit,
  {
    success: [
      ({ props: p, state: s }) =>
        s.set(`user.integrations.zeit`, { token: p.code }),

      actions.updateUserZeitDetails,
      {
        success: set(state`user`, props`user`),
        error: factories.addNotification(
          'Could not authorize with ZEIT',
          'error'
        ),
      },
    ],
    error: factories.addNotification('Could not authorize with ZEIT', 'error'),
  },
  set(state`isLoadingZeit`, false),
];

export const authorize = [
  actions.getAuthToken,
  {
    success: set(state`authToken`, props`token`),
    error: set(state`editor.error`, props`error.message`),
  },
];

export const signInGithub = [
  set(state`isLoadingGithub`, true),
  ...signIn,
  set(state`isLoadingGithub`, false),
];

export const signInCli = [
  signIn,
  when(state`user`),
  {
    true: [authorize],
    false: [],
  },
];

export const loadSearch = factories.withLoadApp([]);

export const loadTerms = factories.withLoadApp([]);

export const loadCLI = [
  factories.withLoadApp([]),
  when(state`user`),
  {
    true: [authorize],
    false: [],
  },
];

export const loadCLIInstructions = factories.withLoadApp([]);

export const loadSandboxPage = factories.withLoadApp([]);

export const loadGitHubPage = factories.withLoadApp([]);

export const loadSandbox = factories.withLoadApp([
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
      // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
      // can mark real changed modules as unchanged
      set(state`editor.changedModuleShortids`, []),

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
          ensurePackageJSON,
        ],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
    ],
  },
  set(state`editor.isLoading`, false),
]);
