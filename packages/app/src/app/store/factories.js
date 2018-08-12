import { sequence, parallel } from 'cerebral';
import { set, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import trackAnalytics from 'common/utils/analytics';
import * as actions from './actions';
import { initializeNotifications } from './modules/user-notifications/sequences';

export function addTabById(id) {
  // eslint-disable-next-line
  return function addTabById({ state, resolve }) {
    const modules = state.get('editor.currentSandbox.modules');
    const m = modules.find(module => module.id === resolve.value(id));

    if (m) {
      const { shortid } = m;

      const newTab = {
        type: 'MODULE',
        moduleShortid: shortid,
        dirty: true,
      };
      const tabs = state.get('editor.tabs');

      if (tabs.length === 0) {
        state.push('editor.tabs', newTab);
      } else if (!tabs.some(tab => tab.moduleShortid === shortid)) {
        const dirtyTabIndex = tabs.findIndex(tab => tab.dirty);

        if (dirtyTabIndex >= 0) {
          state.splice('editor.tabs', dirtyTabIndex, 1, newTab);
        } else {
          state.splice('editor.tabs', 0, 0, newTab);
        }
      }
    }
  };
}

const trackedEvents = {};

export function track(e, args, { trackOnce } = { trackOnce: false }) {
  return () => {
    if (!trackOnce || !trackedEvents[e]) {
      trackAnalytics(e, args);

      if (trackOnce) {
        trackedEvents[e] = true;
      }
    }

    return {};
  };
}

export function setCurrentModuleById(id) {
  // eslint-disable-next-line
  return function setCurrentModuleById({ state, resolve }) {
    const sandbox = state.get('editor.currentSandbox');
    const module = sandbox.modules.find(
      moduleEntry => moduleEntry.id === resolve.value(id)
    );

    if (module && state.get('editor.currentModuleShortid') !== module.shortid) {
      state.set('editor.currentModuleShortid', module.shortid);
    }
  };
}

export function setCurrentModule(id) {
  return sequence('setCurrentModule', [
    set(state`editor.currentTabId`, null),
    addTabById(id),
    setCurrentModuleById(id),
  ]);
}

export function addNotification(
  title,
  notificationType,
  timeAlive = 2,
  buttons = []
) {
  // eslint-disable-next-line
  return function addNotification({ state, resolve }) {
    const now = Date.now();

    state.push('notifications', {
      id: now,
      title: resolve.value(title),
      notificationType: resolve.value(notificationType),
      buttons: resolve.value(buttons),
      endTime: now + resolve.value(timeAlive) * 1000,
    });
  };
}

export function updateSandboxUrl(sandbox) {
  // eslint-disable-next-line
  return function updateSandboxUrl({ router, resolve }) {
    router.updateSandboxUrl(resolve.value(sandbox));
  };
}

const shouldShowThemingOption = when(state`isLoggedIn`, () => {
  if (document.cookie.includes('theming-seen=1')) {
    return false;
  }

  document.cookie = 'theming-seen=1; Path=/;';

  return true;
});

export function withLoadApp(continueSequence) {
  return sequence('loadApp', [
    when(state`hasLoadedApp`),
    {
      true: continueSequence,
      false: [
        set(state`isAuthenticating`, true),
        actions.setJwtFromStorage,
        actions.listenToConnectionChange,
        actions.setStoredSettings,
        actions.setKeybindings,
        actions.startKeybindings,

        shouldShowThemingOption,
        {
          true: [
            addNotification(
              'You can now use your VSCode theme on CodeSandbox! Check it out in your preferences.',
              'notice',
              60 // a minute
            ),
          ],
          false: [],
        },

        when(state`jwt`),
        {
          true: [
            parallel([
              sequence('loadUser', [
                actions.getUser,
                {
                  success: [
                    set(state`user`, props`user`),
                    actions.setPatronPrice,
                    actions.setSignedInCookie,
                    actions.connectWebsocket,
                    initializeNotifications,
                  ],
                  error: [
                    addNotification(
                      'Your session seems to be expired, please log in again...',
                      'error'
                    ),
                    actions.removeJwtFromStorage,
                  ],
                },
              ]),
              continueSequence,
            ]),
          ],
          false: [
            actions.removeJwtFromStorage, // To delete the signedIn cookie as well, to be sure
            continueSequence,
          ],
        },
        set(state`hasLoadedApp`, true),
        set(state`isAuthenticating`, false),
        actions.getContributors,
      ],
    },
  ]);
}
