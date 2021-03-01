import { Action, AsyncAction } from 'app/overmind';
import { AxiosError } from 'axios';
import { get } from 'lodash-es';

import * as internalActions from './internalActions';

export const internal = internalActions;

const getVercelErrorMessage = (error: AxiosError) =>
  get(
    error,
    'response.data.error.message',
    'An unknown error occurred when connecting to Vercel'
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

  try {
    const id = await effects.netlify.deploy(sandbox);
    state.deployment.deploying = false;

    await actions.deployment.getNetlifyDeploys();

    state.deployment.building = true;
    await effects.netlify.getLogs(id);
    effects.notificationToast.success('Sandbox Deploying');
  } catch (error) {
    actions.internal.handleError({
      message: 'An error occurred when deploying your Netlify site',
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
    const vercelConfig = effects.vercel.getConfig(state.editor.currentSandbox);

    state.deployment.hasAlias = !!vercelConfig.alias;
    if (vercelConfig.name) {
      state.deployment.sandboxDeploys = await effects.vercel.getDeployments(
        vercelConfig.name
      );
    }
  } catch (error) {
    actions.internal.handleError({
      message: getVercelErrorMessage(error),
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

    if (sandbox.isSse && state.editor.currentSandbox) {
      const envs = await effects.api.getEnvironmentVariables(
        state.editor.currentSandbox.id
      );
      if (envs) {
        await effects.vercel.checkEnvironmentVariables(sandbox, envs);
      }
    }

    state.deployment.url = await effects.vercel.deploy(contents, sandbox);
  } catch (error) {
    actions.internal.handleError({
      message: getVercelErrorMessage(error),
      error,
    });
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};

export const deploySandboxClicked: AsyncAction = async ({
  actions,
  effects,
  state,
}) => {
  state.currentModal = 'deployment';

  const vercelIntegration = state.user && state.user.integrations.zeit;

  if (!vercelIntegration || !vercelIntegration.token) {
    effects.notificationToast.error(
      'You are not authorized with Vercel, please refresh and log in again'
    );
    return;
  }

  if (!vercelIntegration.email) {
    try {
      const user = await effects.vercel.getUser();

      if (state.user && state.user.integrations.zeit) {
        state.user.integrations.zeit.email = user.email;
      }
    } catch (error) {
      actions.internal.handleError({
        message: 'Could not authorize with Vercel',
        error,
      });
    }
  }

  state.deployment.url = null;
};

export const setDeploymentToDelete: Action<string> = ({ state }, id) => {
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
    await effects.vercel.deleteDeployment(id);

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

  const vercelConfig = effects.vercel.getConfig(state.editor.currentSandbox);

  try {
    const url = await effects.vercel.aliasDeployment(id, vercelConfig);

    effects.notificationToast.success(`Deployed to ${url}`);
    actions.deployment.getDeploys();
  } catch (error) {
    actions.internal.handleError({
      message: 'An unknown error occurred when aliasing your deployment',
      error,
    });
  }
};
