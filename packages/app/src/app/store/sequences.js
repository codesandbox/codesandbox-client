import { sequence } from 'cerebral';
import { when, push, unset, set, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import getTemplateDefinition from '@codesandbox/common/lib/templates';

import * as actions from './actions';
import * as factories from './factories';
import { connectToChannel as setupNotifications } from './modules/user-notifications/actions';
import { CancelError } from './errors';

import {
  saveNewModule,
  createOptimisticModule,
  updateOptimisticModule,
  removeModule,
  recoverFiles,
  syncFilesToFS,
} from './modules/files/actions';

import { disconnect, clearUserSelections } from './modules/live/actions';
import { setupExecutor } from './modules/editor/actions';
import { initializeLive } from './modules/live/common-sequences';
import { resetServerState } from './modules/server/actions';

export const unloadApp = actions.stopListeningToConnectionChange;

export const setConnection = set(state`connected`, props`connection`);

export const showAuthenticationError = [];

export const openModal = [actions.setModal];

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

export const resetLive = [
  clearUserSelections,
  set(state`live.isLive`, false),
  set(state`live.error`, null),
  set(state`live.isLoading`, false),
  set(state`live.roomInfo`, undefined),

  ({ ot }) => {
    ot.reset();
  },
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
  when(
    state`editor.currentId`,
    props`sandbox.id`,
    state`live.isLoading`,
    // If we don't add the live check we will never initialize this state, since the roomJoined sequence also initializes
    // editor.currentId to sandbox.id, which causes this check to always resolve to true
    (currentId, newId, isLoadingLive) => currentId === newId && !isLoadingLive
  ),
  {
    true: [],
    false: [
      set(props`oldId`, state`editor.currentId`),
      set(state`editor.currentId`, props`sandbox.id`),
      actions.setCurrentModuleShortid,
      actions.setMainModuleShortid,
      actions.setInitialTab,
      actions.setUrlOptions,
      actions.setWorkspace,
      set(state`editor.workspaceConfigCode`, ''),

      resetServerState,
      setupExecutor,
      syncFilesToFS,

      // Check because in live oldId === currentId
      when(
        props`oldId`,
        state`editor.currentId`,
        (oldId, currentId) => oldId === currentId
      ),
      {
        true: [],
        // Remove the old sandbox because it's stale with the changes the user did on it (for example,
        // the user might have changed code of a file and then forked. We didn't revert the code back
        // to its old state so if the user opens this sandbox again it shows wrong code)
        false: [unset(state`editor.sandboxes.${props`oldId`}`)],
      },
    ],
  },
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

const setSandboxData = [
  when(props`noOverwriteFiles`),
  {
    false: [set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`)],
    true: [
      set(
        state`editor.sandboxes.${props`sandbox.id`}.collection`,
        props`sandbox.collection`
      ),
      set(
        state`editor.sandboxes.${props`sandbox.id`}.owned`,
        props`sandbox.owned`
      ),
      set(
        state`editor.sandboxes.${props`sandbox.id`}.userLiked`,
        props`sandbox.userLiked`
      ),
      set(
        state`editor.sandboxes.${props`sandbox.id`}.title`,
        props`sandbox.title`
      ),
    ],
  },
];

export const forkSandbox = sequence('forkSandbox', [
  canForkServerSandbox,
  {
    true: [
      factories.track('Fork Sandbox', {}),
      set(state`editor.isForkingSandbox`, true),
      actions.forkSandbox,
      {
        success: [
          actions.moveModuleContent,
          setSandboxData,
          setSandbox,
          factories.addNotification('Forked sandbox!', 'success'),
          factories.updateSandboxUrl(props`sandbox`),
          ensurePackageJSON,
          set(state`editor.isForkingSandbox`, false),
        ],
        error: set(state`editor.isForkingSandbox`, false),
      },
    ],
    false: [
      factories.track('Show Server Fork Sign In Modal', {}),
      set(props`modal`, 'forkServerModal'),
      openModal,
    ],
  },
]);

function stopFrozenSandboxFromEdit() {
  throw new CancelError("You can't save a frozen sandbox", {});
}

export const forkFrozenSandbox = sequence('forkFrozenSandbox', [
  when(state`editor.currentSandbox.isFrozen`) &&
    when(state`editor.sessionFrozen`),
  {
    true: [
      set(state`currentModal`, 'forkFrozenModal'),
      set(props`message`, "Can't save a frozen sandbox"),
      actions.callVSCodeCallbackError,
      stopFrozenSandboxFromEdit,
    ],
    false: [],
  },
]);

export const ensureOwnedEditable = sequence('ensureOwnedEditable', [
  when(state`editor.currentSandbox.owned`, owned => owned),
  {
    true: [
      when(state`editor.currentSandbox.isFrozen`, isFrozen => isFrozen),
      {
        true: forkFrozenSandbox,
        false: [],
      },
    ],
    false: forkSandbox,
  },
]);

export const fetchGitChanges = [
  set(state`git.isFetching`, true),
  actions.getGitChanges,
  set(state`git.originalGitChanges`, props`gitChanges`),
  set(state`git.isFetching`, false),
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
        success: [set(state`user`, props`user`), getZeitUserDetails],
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

export const loadSearch = factories.withLoadApp([]);

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

export const joinLiveSessionIfAvailable = [
  when(
    props`sandbox.owned`,
    props`sandbox.roomId`,
    (owned, roomId) => owned && roomId
  ),
  {
    true: [
      set(props`sandboxId`, props`sandbox.id`),

      when(props`sandbox.team`),
      {
        true: [set(state`live.isTeam`, true)],
        false: [],
      },

      setSandboxData,
      set(state`live.isLoading`, true),
      setSandbox,
      set(props`roomId`, props`sandbox.roomId`),
      initializeLive,
      set(state`live.isLoading`, false),
    ],
    false: [
      setSandboxData,
      setSandbox,
      when(props`sandbox.owned`),
      {
        true: [recoverFiles],
        false: [],
      },
    ],
  },
];

const teamChanged = when(
  props`sandbox.team`,
  state`editor.currentSandbox.team`,
  (team1, team2) => (team1 || {}).id !== (team2 || {}).id
);

export const refetchSandboxInfo = [
  when(state`editor.currentId`),
  {
    true: [
      set(props`noOverwriteFiles`, true),
      set(props`id`, state`editor.currentId`),
      actions.getSandbox,
      {
        success: [
          setSandboxData,
          // TODO: move this to a better place, this is duplicate logic with live
          when(state`live.isLive`),
          {
            true: [disconnect],
            false: [],
          },

          teamChanged,
          {
            true: [
              set(
                state`editor.sandboxes.${props`sandbox.id`}.team`,
                props`sandbox.team`
              ),
            ],
            false: [],
          },

          joinLiveSessionIfAvailable,
        ],
      },
    ],
    false: [],
  },
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
          actions.loadTemplatesForStartModal,
          setupNotifications,
          refetchSandboxInfo,
        ],
        unauthorized: [
          factories.addNotification('Github Authentication Error', 'error'),
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

  refetchSandboxInfo,
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

export const loadSandbox = factories.withLoadApp([
  set(state`editor.error`, null),

  actions.setIdFromAlias,

  when(
    state`editor.sandboxes.${props`id`}`,
    sandbox => sandbox && !sandbox.team
  ),
  {
    true: [
      set(props`sandbox`, state`editor.sandboxes.${props`id`}`),
      setSandbox,

      refetchSandboxInfo,
    ],
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      // Only reset changed modules if sandbox wasn't in memory, otherwise a fork
      // can mark real changed modules as unchanged
      set(state`editor.changedModuleShortids`, []),

      actions.getSandbox,
      {
        success: [joinLiveSessionIfAvailable, ensurePackageJSON],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
    ],
  },

  set(state`editor.isLoading`, false),
]);

export const setUpdateStatus = [set(state`updateStatus`, props`status`)];

export const track = [
  ({ props: givenProps }) =>
    factories.track(givenProps.name, givenProps.data)(),
];
