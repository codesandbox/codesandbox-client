import { Context } from 'app/overmind';
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

export const deployWithNetlify = async ({
  effects,
  actions,
  state,
}: Context) => {
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

export const getNetlifyDeploys = async ({ state, effects }: Context) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }

  try {
    state.deployment.netlify.claimUrl = await effects.netlify.claimSite(
      sandbox.id
    );
    state.deployment.netlify.site = await effects.netlify.getDeployments(
      sandbox.id
    );
  } catch (error) {
    state.deployment.netlify.site = null;
  }
};

export const getDeploys = async ({ state, actions, effects }: Context) => {
  if (
    !state.user ||
    !state.user.integrations.vercel ||
    !state.editor.currentSandbox
  ) {
    return;
  }

  state.deployment.vercel.gettingDeploys = true;

  try {
    const vercelConfig = effects.vercel.getConfig(state.editor.currentSandbox);

    if (vercelConfig.name) {
      state.deployment.vercel.deploys = await effects.vercel.getDeployments(
        vercelConfig.name
      );
    }
  } catch (error) {
    actions.internal.handleError({
      message: getVercelErrorMessage(error),
      error,
    });
  }

  state.deployment.vercel.gettingDeploys = false;
};

export const deployPreviewClicked = async ({
  state,
  effects,
  actions,
}: Context) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  try {
    state.deployment.deploying = true;
    const zip = await effects.zip.create(sandbox);
    const contents = await effects.jsZip.loadAsync(zip.file);

    state.deployment.vercel.url = await effects.vercel.deploy(
      contents,
      sandbox
    );
  } catch (error) {
    actions.internal.handleError({
      message: getVercelErrorMessage(error),
      error,
    });
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};
export const deployProductionClicked = async ({
  state,
  effects,
  actions,
}: Context) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  try {
    state.deployment.deploying = true;
    const zip = await effects.zip.create(sandbox);
    const contents = await effects.jsZip.loadAsync(zip.file);

    state.deployment.vercel.url = await effects.vercel.deploy(
      contents,
      sandbox,
      'production'
    );
  } catch (error) {
    actions.internal.handleError({
      message: getVercelErrorMessage(error),
      error,
    });
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};

export const deploySandboxClicked = async ({
  actions,
  effects,
  state,
}: Context) => {
  state.currentModal = 'deployment';

  const vercelIntegration = state.user && state.user.integrations.vercel;

  if (!vercelIntegration || !vercelIntegration.token) {
    effects.notificationToast.error(
      'You are not authorized with Vercel, please refresh and log in again'
    );
    return;
  }

  if (!vercelIntegration.email) {
    try {
      const user = await effects.vercel.getUser();

      if (state.user && state.user.integrations.vercel) {
        state.user.integrations.vercel.email = user.email;
      }
    } catch (error) {
      actions.internal.handleError({
        message:
          'We were not able to fetch your Vercel user details. You should still be able to deploy to Vercel, please try again if needed.',
        error,
      });
    }
  }

  state.deployment.vercel.url = null;
};

export const setDeploymentToDelete = ({ state }: Context, id: string) => {
  state.deployment.vercel.deployToDelete = id;
};

export const deleteDeployment = async ({
  state,
  effects,
  actions,
}: Context) => {
  const id = state.deployment.vercel.deployToDelete;

  if (!id) {
    return;
  }

  state.currentModal = null;
  state.deployment.vercel.deploysBeingDeleted.push(id);

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

  state.deployment.vercel.deploysBeingDeleted.splice(
    state.deployment.vercel.deploysBeingDeleted.indexOf(id),
    1
  );
};

export const deployWithGitHubPages = async ({
  effects,
  actions,
  state,
}: Context) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }

  state.deployment.deploying = true;

  try {
    await effects.githubPages.deploy(
      sandbox,
      state.deployment.githubSite.ghLogin
    );
    state.deployment.deploying = false;

    state.deployment.building = true;
    await effects.githubPages.getLogs(sandbox.id);
    state.deployment.githubSite.ghPages = true;
    effects.notificationToast.success('Sandbox Deploying');
  } catch (error) {
    actions.internal.handleError({
      message: 'An error occurred when deploying your sandbox to GitHub Pages',
      error,
    });
  }
  state.deployment.deploying = false;
  state.deployment.building = false;
};

export const fetchGithubSite = async ({ effects, state }: Context) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  try {
    const site = await effects.githubPages.getSite(sandbox.id);
    state.deployment.githubSite = {
      ...site,
      name: `csb-${sandbox.id}`,
    };
  } catch {
    state.deployment.githubSite.name = `csb-${sandbox.id}`;
  }
};
