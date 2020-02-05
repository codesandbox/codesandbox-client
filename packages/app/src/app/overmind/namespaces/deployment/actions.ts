import { Action, AsyncAction } from 'app/overmind';
import { AxiosError } from 'axios';
import { get } from 'lodash-es';

import * as internalActions from './internalActions';

export const internal = internalActions;

const getZeitErrorMessage = (error: AxiosError) =>
  get(
    error,
    'response.data.error.message',
    'An unknown error occurred when connecting to ZEIT'
  );

export const deployWithNetlify: AsyncAction = async ({
  effects,
  actions,
  state,
}) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  state.deployment.deploying = true;
  state.deployment.netlifyLogs = null;

  const zip = await effects.zip.create(sandbox);

  try {
    const id = await effects.netlify.deploy(zip.file, sandbox);
    state.deployment.deploying = false;

    await actions.deployment.getNetlifyDeploys();
    // Does not seem that we use this thing? Not in other code either
    // const deploys = await actions.deployment.internal.getNetlifyDeploys();
    state.deployment.building = true;
    await effects.netlify.waitForDeploy(id, logUrl => {
      if (!state.deployment.netlifyLogs) {
        state.deployment.netlifyLogs = logUrl;
      }
    });
    effects.notificationToast.success('Sandbox Deployed');
  } catch (error) {
    actions.internal.handleError({
      message: 'An unknown error occurred when deploying your Netlify site',
      error,
    });
  }
  state.deployment.deploying = false;
  state.deployment.building = false;
};

export const getNetlifyDeploys: AsyncAction = async ({ state, effects }) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }

  try {
    state.deployment.netlifyClaimUrl = await effects.netlify.claimSite(
      sandbox.id
    );
    state.deployment.netlifySite = await effects.netlify.getDeployments(
      sandbox.id
    );
  } catch (error) {
    state.deployment.netlifySite = null;
  }
};

export const getDeploys: AsyncAction = async ({ state, actions, effects }) => {
  if (
    !state.user ||
    !state.user.integrations.zeit ||
    !state.editor.currentSandbox
  ) {
    return;
  }

  state.deployment.gettingDeploys = true;

  try {
    const zeitConfig = effects.zeit.getConfig(state.editor.currentSandbox);

    state.deployment.hasAlias = !!zeitConfig.alias;
    if (zeitConfig.name) {
      state.deployment.sandboxDeploys = await effects.zeit.getDeployments(
        zeitConfig.name
      );
    }
  } catch (error) {
    actions.internal.handleError({
      message: getZeitErrorMessage(error),
      error,
    });
  }

  state.deployment.gettingDeploys = false;
};

export const deployClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  try {
    state.deployment.deploying = true;
    const zip = await effects.zip.create(sandbox);
    const contents = await effects.jsZip.loadAsync(zip.file);
    state.deployment.url = await effects.zeit.deploy(contents, sandbox);
  } catch (error) {
    actions.internal.handleError({
      message: getZeitErrorMessage(error),
      error,
    });
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};

export const deploySandboxClicked: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  state.currentModal = 'deployment';

  const zeitIntegration = state.user && state.user.integrations.zeit;

  if (!zeitIntegration || !zeitIntegration.token) {
    effects.notificationToast.error(
      'You are not authorized with Zeit, please refresh and log in again'
    );
    return;
  }

  if (!zeitIntegration.email) {
    try {
      const user = await effects.zeit.getUser();

      if (state.user && state.user.integrations.zeit) {
        state.user.integrations.zeit.email = user.email;
      }
    } catch (error) {
      actions.internal.handleError({
        message: 'Could not authorize with ZEIT',
        error,
      });
    }
  }

  state.deployment.url = null;
};

export const setDeploymentToDelete: Action<{
  id: string;
}> = ({ state }, { id }) => {
  state.deployment.deployToDelete = id;
};

export const deleteDeployment: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const id = state.deployment.deployToDelete;

  if (!id) {
    return;
  }

  state.currentModal = null;
  state.deployment.deploysBeingDeleted.push(id);

  try {
    await effects.zeit.deleteDeployment(id);

    effects.notificationToast.success('Deployment deleted');
    actions.deployment.getDeploys();
  } catch (error) {
    actions.internal.handleError({
      message: 'An unknown error occurred when deleting your deployment',
      error,
    });
  }

  state.deployment.deploysBeingDeleted.splice(
    state.deployment.deploysBeingDeleted.indexOf(id),
    1
  );
};

export const aliasDeployment: AsyncAction<string> = async (
  { state, effects, actions },
  id
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const zeitConfig = effects.zeit.getConfig(state.editor.currentSandbox);

  try {
    const url = await effects.zeit.aliasDeployment(id, zeitConfig);

    effects.notificationToast.success(`Deployed to ${url}`);
    actions.deployment.getDeploys();
  } catch (error) {
    actions.internal.handleError({
      message: 'An unknown error occurred when aliasing your deployment',
      error,
    });
  }
};
