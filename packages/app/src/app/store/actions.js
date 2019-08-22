import axios from 'axios';
import { client } from 'app/graphql/client';
import { LIST_TEMPLATES } from 'app/pages/Dashboard/queries';

import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { parseSandboxConfigurations } from '@codesandbox/common/lib/templates/configuration/parse-sandbox-configurations';
import track, {
  identify,
  setUserId,
} from '@codesandbox/common/lib/utils/analytics';
import {
  sandboxUrl,
  editorUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';

import { mainModule, defaultOpenedModule } from './utils/main-module';
import getItems from './modules/workspace/items';

/**
 * We use this to eagerly load templates for the new sandbox modal.
 */
export function loadTemplatesForStartModal() {
  client.query({ query: LIST_TEMPLATES, variables: { showAll: true } });
}

export function getSandbox({ props, api, path }) {
  return api
    .get(`/sandboxes/${props.id}`)
    .then(data => {
      // data.template = 'custom';
      const sandbox = data;
      return path.success({ sandbox });
    })
    .catch(error => {
      if (error.response.status === 404) {
        return path.notFound();
      }

      return path.error({ error });
    });
}

/**
 * Sometimes the alias is set as "id" in the url, if we already have that
 * sandbox in the state we need to make sure that the id is set correctly.
 * This function is reps
 */
export function setIdFromAlias({ props, state }) {
  if (state.get(`editor.sandboxes.${props.id}`)) {
    return {};
  }

  const sandboxes = state.get(`editor.sandboxes`).toJSON();
  const matchingSandbox = Object.keys(sandboxes).find(
    id => sandboxUrl(sandboxes[id]) === `${editorUrl()}${props.id}`
  );

  if (matchingSandbox) {
    return { id: matchingSandbox };
  }

  return {};
}

export function callVSCodeCallback({ props }) {
  const { cbID } = props;
  if (cbID) {
    if (window.cbs && window.cbs[cbID]) {
      window.cbs[cbID](undefined, undefined);
      delete window.cbs[cbID];
    }
  }
}

export function callVSCodeCallbackError({ props }) {
  const { cbID } = props;
  if (cbID) {
    if (window.cbs && window.cbs[cbID]) {
      const errorMessage =
        props.message || 'Something went wrong while saving the file.';
      window.cbs[cbID](new Error(errorMessage), undefined);
      delete window.cbs[cbID];
    }
  }
}

export function setWorkspace({ controller, state, props }) {
  state.set('workspace.project.title', props.sandbox.title || '');
  state.set('workspace.project.description', props.sandbox.description || '');
  state.set('workspace.project.alias', props.sandbox.alias || '');

  const items = getItems(controller.getState());
  const defaultItem = items.find(i => i.defaultOpen) || items[0];
  state.set(`workspace.openedWorkspaceItem`, defaultItem.id);
}

export function setUrlOptions({ state, router, utils }) {
  const options = router.getSandboxOptions();

  if (options.currentModule) {
    const sandbox = state.get('editor.currentSandbox');

    try {
      const module = utils.resolveModule(
        options.currentModule,
        sandbox.modules,
        sandbox.directories,
        options.currentModule.directoryShortid
      );

      if (module) {
        state.push('editor.tabs', {
          type: 'MODULE',
          moduleShortid: module.shortid,
          dirty: false,
        });
        state.set('editor.currentModuleShortid', module.shortid);
      }
    } catch (err) {
      const now = Date.now();
      const title = `Could not find the module ${options.currentModule}`;

      state.push('notifications', {
        title,
        id: now,
        notificationType: 'warning',
        endTime: now + 2000,
        buttons: [],
      });
    }
  }

  state.set(
    'preferences.showPreview',
    options.isPreviewScreen || options.isSplitScreen
  );
  state.set(
    'preferences.showEditor',
    options.isEditorScreen || options.isSplitScreen
  );

  if (options.initialPath) state.set('editor.initialPath', options.initialPath);
  if (options.fontSize)
    state.set('preferences.settings.fontSize', options.fontSize);
  if (options.highlightedLines)
    state.set('editor.highlightedLines', options.highlightedLines);
  if (options.hideNavigation)
    state.set('preferences.hideNavigation', options.hideNavigation);
  if (options.isInProjectView)
    state.set('editor.isInProjectView', options.isInProjectView);
  if (options.autoResize)
    state.set('preferences.settings.autoResize', options.autoResize);
  if (options.useCodeMirror)
    state.set('preferences.settings.useCodeMirror', options.useCodeMirror);
  if (options.enableEslint)
    state.set('preferences.settings.enableEslint', options.enableEslint);
  if (options.forceRefresh)
    state.set('preferences.settings.forceRefresh', options.forceRefresh);
  if (options.expandDevTools)
    state.set('preferences.showDevtools', options.expandDevTools);
  if (options.runOnClick)
    state.set(`preferences.runOnClick`, options.runOnClick);
}

export function setCurrentModuleShortid({ props, state }) {
  const currentModuleShortid = state.get('editor.currentModuleShortid');
  const sandbox = props.sandbox;

  // Only change the module shortid if it doesn't exist in the new sandbox
  if (
    sandbox.modules.map(m => m.shortid).indexOf(currentModuleShortid) === -1
  ) {
    const parsedConfigs = parseSandboxConfigurations(sandbox);
    const module = defaultOpenedModule(sandbox, parsedConfigs);

    state.set('editor.currentModuleShortid', module.shortid);
  }
}

export function showUserSurveyIfNeeded({ state, controller, api }) {
  if (state.get('user.sendSurvey')) {
    // Let the server know that we've seen the survey
    api.post('/users/survey-seen', {});

    notificationState.addNotification({
      title: 'Help improve CodeSandbox',
      message:
        "We'd love to hear your thoughts, it's 7 questions and will only take 2 minutes.",
      status: NotificationStatus.NOTICE,
      sticky: true,
      actions: {
        primary: [
          {
            label: 'Open Survey',
            run: () => {
              controller.getSignal('modalOpened')({
                modal: 'userSurvey',
              });
            },
          },
        ],
      },
    });
  }
}

export function setMainModuleShortid({ props, state }) {
  const sandbox = props.sandbox;
  const parsedConfigs = parseSandboxConfigurations(sandbox);
  const module = mainModule(sandbox, parsedConfigs);

  state.set('editor.mainModuleShortid', module.shortid);
}

export function setInitialTab({ state }) {
  const currentModule = state.get('editor.currentModule');
  const newTab = {
    type: 'MODULE',
    moduleShortid: currentModule.shortid,
    dirty: true,
  };

  state.set('editor.tabs', [newTab]);
}

export function getGitChanges({ api, state }) {
  const id = state.get('editor.currentId');

  return api
    .get(`/sandboxes/${id}/git/diff`)
    .then(gitChanges => ({ gitChanges }));
}

export function forkSandbox({ state, props, api, path }) {
  const sandboxId = props.sandboxId || state.get('editor.currentId');
  const url = sandboxId.includes('/')
    ? `/sandboxes/fork/${sandboxId}`
    : `/sandboxes/${sandboxId}/fork`;

  return api
    .post(url, props.body || {})
    .then(data => path.success({ forkedSandbox: data }))
    .catch(error => path.error({ error }));
}

export function moveModuleContent({ props, state }) {
  const currentSandbox = state.get('editor.currentSandbox');

  if (currentSandbox) {
    return {
      sandbox: {
        ...props.forkedSandbox,
        modules: props.forkedSandbox.modules.map(module => ({
          ...module,
          code: currentSandbox.modules.find(
            currentSandboxModule =>
              currentSandboxModule.shortid === module.shortid
          ).code,
        })),
      },
    };
  }

  return { sandbox: props.forkedSandbox };
}

export function closeTabByIndex({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const currentModule = state.get('editor.currentModule');
  const tabs = state.get('editor.tabs');
  const tabModuleId = tabs[props.tabIndex].moduleId;
  const isActiveTab = currentModule.id === tabModuleId;

  if (isActiveTab) {
    const newTab =
      props.tabIndex > 0 ? tabs[props.tabIndex - 1] : tabs[props.tabIndex + 1];

    if (newTab) {
      const newModule = sandbox.modules.find(
        module => module.id === newTab.moduleId
      );

      state.set('editor.currentModuleShortid', newModule.shortid);
    }
  }

  state.splice('editor.tabs', props.tabIndex, 1);
}

export function signInGithub({ browser, path, props }) {
  const { useExtraScopes } = props;
  const popup = browser.openPopup(
    `/auth/github${useExtraScopes ? '?scope=user:email,repo' : ''}`,
    'sign in'
  );

  return browser.waitForMessage('signin').then(data => {
    const jwt = data.jwt;

    popup.close();

    if (jwt) {
      return path.success({ jwt });
    }

    return path.error();
  });
}

export function signOut({ api }) {
  api.delete(`/users/signout`);
}

export function getAuthToken({ api, path }) {
  return api
    .get('/auth/auth-token')
    .then(({ token }) => path.success({ token }))
    .catch(error => path.error({ error }));
}

export function setModal({ state, props }) {
  track('Open Modal', { modal: props.modal });
  state.set('currentModalMessage', props.message);
  state.set('currentModal', props.modal);
}

export function setStoredSettings({ state, settingsStore }) {
  const settings = settingsStore.getAll();

  if (settings.keybindings) {
    settings.keybindings = Object.keys(settings.keybindings).reduce(
      (value, key) =>
        value.concat({
          key,
          bindings: settings.keybindings[key],
        }),
      []
    );
  }

  state.merge('preferences.settings', settings);
}

export function setKeybindings({ state, keybindingManager }) {
  keybindingManager.set(state.get('preferences.settings.keybindings').toJSON());
}

export function startKeybindings({ keybindingManager }) {
  keybindingManager.start();
}

export function removeNotification({ state, props }) {
  const notifications = state.get('notifications');
  const notificationToRemoveIndex = notifications.findIndex(
    notification => notification.id === props.id
  );

  state.splice('notifications', notificationToRemoveIndex, 1);
}

export function getUser({ api, path }) {
  return api
    .get('/users/current')
    .then(data => path.success({ user: data }))
    .catch(e => {
      if (e.response.status === 401) {
        return path.unauthorized();
      }

      return path.error();
    });
}

export function connectWebsocket({ socket }) {
  if (process.env.LOCAL_SERVER) {
    // TODO: Make the ws proxy work in start.js
    return {};
  }

  return socket.connect();
}

export function setJwtFromProps({ jwt, state, props }) {
  jwt.set(props.jwt);
  state.set('jwt', props.jwt);
}

export function setJwtFromStorage({ jwt, state }) {
  state.set('jwt', jwt.get() || null);
}

export function removeJwtFromStorage({ jwt, state }) {
  jwt.reset();
  state.set('jwt', null);
}

export function setSignedInCookie({ props }) {
  document.cookie = 'signedIn=true; Path=/;';
  identify('signed_in', true);
  setUserId(props.user.id);
}

export function listenToConnectionChange({ connection }) {
  connection.addListener('connectionChanged');
}

export function stopListeningToConnectionChange({ connection }) {
  connection.removeListener('connectionChanged');
}

export function setPatronPrice({ props, state }) {
  state.set(
    'patron.price',
    props.user.subscription ? props.user.subscription.amount : 10
  );
}

export function signInZeit({ browser, path }) {
  const popup = browser.openPopup('/auth/zeit', 'sign in');
  return browser.waitForMessage('signin').then(data => {
    popup.close();

    if (data && data.code) {
      return path.success({ code: data.code });
    }

    return path.error();
  });
}

export function updateUserZeitDetails({ api, path, props }) {
  const { code } = props;

  return api
    .post(`/users/current_user/integrations/zeit`, {
      code,
    })
    .then(data => path.success({ user: data }))
    .catch(error => path.error({ error }));
}

export function getZeitIntegrationDetails({ state, path }) {
  const token = state.get(`user.integrations.zeit.token`);

  return axios
    .get('https://api.zeit.co/www/user', {
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
    .then(response => path.success({ response: response.data }))
    .catch(error => path.error({ error }));
}

export function signOutZeit({ api }) {
  return api.delete(`/users/current_user/integrations/zeit`).then(() => {});
}

export function signOutGithubIntegration({ api }) {
  return api.delete(`/users/current_user/integrations/github`).then(() => {});
}

export function createPackageJSON({ props }) {
  const { sandbox } = props;

  const code = generateFileFromSandbox(sandbox);

  return {
    title: 'package.json',
    newCode: code,
  };
}

export function getContributors({ state }) {
  return window
    .fetch(
      'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/.all-contributorsrc'
    )
    .then(x => x.json())
    .then(x => x.contributors.map(u => u.login))
    .then(names => state.set('contributors', names))
    .catch(() => {});
}
