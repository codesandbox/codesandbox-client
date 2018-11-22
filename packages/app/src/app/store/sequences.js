import { sequence } from 'cerebral';
import { when, push, unset, set, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import getTemplateDefinition from 'common/templates';

import * as actions from './actions';
import * as factories from './factories';
import { connectToChannel as setupNotifications } from './modules/user-notifications/actions';

import {
  saveNewModule,
  createOptimisticModule,
  updateOptimisticModule,
  removeModule,
  recoverFiles,
} from './modules/files/actions';

import { disconnect } from './modules/live/actions';
import { initializeLive } from './modules/live/common-sequences';

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
            error: [
              set(props`moduleShortid`, props`optimisticModule.shortid`),
              removeModule,
            ],
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

const canForkServerSandbox = when(
  state`editor.currentSandbox.template`,
  state`isLoggedIn`,
  (template, isLoggedIn) => {
    if (!isLoggedIn) {
      const templateDefinition = getTemplateDefinition(template);

      if (templateDefinition.isServer) {
        return false;
      }
    }
    return true;
  }
);

export const forkSandbox = sequence('forkSandbox', [
  canForkServerSandbox,
  {
    true: [
      factories.track('Fork Sandbox', {}),
      set(state`editor.isForkingSandbox`, true),
      actions.forkSandbox,
      actions.moveModuleContent,
      set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
      set(state`editor.currentId`, props`sandbox.id`),
      factories.addNotification('Forked sandbox!', 'success'),
      factories.updateSandboxUrl(props`sandbox`),
      ensurePackageJSON,
      set(state`editor.isForkingSandbox`, false),
    ],
    false: [
      factories.track('Show Server Fork Sign In Modal', {}),
      set(props`modal`, 'forkServerModal'),
      openModal,
    ],
  },
]);

export const ensureOwnedEditable = sequence('ensureOwnedEditable', [
  when(
    state`editor.currentSandbox.owned`,
    state`editor.currentSandbox.isFrozen`,
    (owned, frozen) => !owned || frozen
  ),
  {
    true: forkSandbox,
    false: [],
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
  factories.track('Sign In', {}),
  actions.signInGithub,
  {
    success: [
      actions.setJwtFromProps,
      actions.getUser,
      {
        success: [
          set(state`user`, props`user`),
          actions.setPatronPrice,
          actions.setSignedInCookie,
          actions.setStoredSettings,
          actions.connectWebsocket,
          setupNotifications,
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
  factories.track('Sign Out', {}),
  set(state`workspace.openedWorkspaceItem`, 'files'),
  when(state`live.isLive`),
  {
    true: disconnect,
    false: [],
  },
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
  unset(state`user`),
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

export const resetLive = [
  set(state`live.isLive`, false),
  set(state`live.error`, null),
  set(state`live.isLoading`, false),
  set(state`live.deviceId`, null),
  set(state`live.roomInfo`, undefined),
];

export const setSandbox = [
  when(state`live.isLoading`),
  {
    true: [],
    false: [
      when(state`live.isLive`),
      {
        true: resetLive,
        false: [],
      },
    ],
  },
  set(state`editor.currentId`, props`sandbox.id`),
  actions.setCurrentModuleShortid,
  actions.setMainModuleShortid,
  actions.setInitialTab,
  actions.setSandboxConfigOptions,
  actions.setUrlOptions,
  actions.setWorkspace,
];

export const joinLiveSessionIfTeam = [
  when(
    props`sandbox.team`,
    props`sandbox.owned`,
    (team, owned) => team && owned && team.roomId
  ),
  {
    true: [
      set(props`sandboxId`, props`sandbox.id`),
      set(state`live.isTeam`, true),
      set(props`roomId`, props`sandbox.team.roomId`),
      initializeLive,

      when(state`live.isSourceOfTruth`),
      {
        true: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          set(state`live.isLoading`, true),
          setSandbox,
          set(state`live.isLoading`, false),
          factories.track('Create Team Live Session', {}),
        ],
        false: [set(state`editor.currentId`, props`sandbox.id`)],
      },
    ],
    false: [
      set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
      setSandbox,
      when(props`sandbox.owned`),
      {
        true: [recoverFiles],
        false: [],
      },
    ],
  },
];

export const loadSandbox = factories.withLoadApp([
  set(state`editor.error`, null),
  when(
    state`editor.sandboxes.${props`id`}`,
    sandbox => sandbox && !sandbox.team
  ),
  {
    true: [
      set(props`sandbox`, state`editor.sandboxes.${props`id`}`),
      setSandbox,
    ],
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
      // can mark real changed modules as unchanged
      set(state`editor.changedModuleShortids`, []),

      actions.getSandbox,
      {
        success: [joinLiveSessionIfTeam, ensurePackageJSON],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
    ],
  },
  set(state`editor.isLoading`, false),
]);

export const setUpdateStatus = [set(state`updateStatus`, props`status`)];
