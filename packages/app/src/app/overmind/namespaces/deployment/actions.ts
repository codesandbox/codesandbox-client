import { Action, AsyncAction } from 'app/overmind';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const deployWithNetlify: AsyncAction = async ({
  effects,
  actions,
  state,
}) => {
  state.deployment.deploying = true;
  state.deployment.netlifyLogs = null;

  const zip = await effects.zip.create(state.editor.currentSandbox);

  try {
    const id = await effects.netlify.deploy(
      zip.file,
      state.editor.currentSandbox
    );
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
    effects.notificationToast.error(
      'An unknown error occurred when deploying your site'
    );
  }
  state.deployment.deploying = false;
  state.deployment.building = false;
};

export const getNetlifyDeploys: AsyncAction = async ({ state, effects }) => {
  try {
    state.deployment.netlifyClaimUrl = await effects.netlify.claimSite(
      state.editor.currentId
    );
    state.deployment.netlifySite = await effects.netlify.getDeployments(
      state.editor.currentId
    );
  } catch (error) {
    state.deployment.netlifySite = null;
  }
};

export const getDeploys: AsyncAction = async ({ state, effects }) => {
  if (!state.user.integrations.zeit) {
    return;
  }

  state.deployment.gettingDeploys = true;

  try {
    const zeitConfig = effects.zeit.getConfig(state.editor.currentSandbox);

    state.deployment.hasAlias = !!zeitConfig.alias;
    state.deployment.sandboxDeploys = await effects.zeit.getDeployments(
      zeitConfig.name
    );
  } catch (error) {
    effects.notificationToast.error(
      'An unknown error occurred when connecting to ZEIT'
    );
  }

  state.deployment.gettingDeploys = false;
};

export const deployClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  state.deployment.deploying = true;
  const zip = await effects.zip.create(state.editor.currentSandbox);
  const contents = await effects.jsZip.loadAsync(zip.file);

  try {
    state.deployment.url = await effects.zeit.deploy(
      contents,
      state.editor.currentSandbox
    );
  } catch (error) {
    effects.notificationToast.error(
      'An unknown error occurred when connecting to ZEIT'
    );
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};

export const deploySandboxClicked: AsyncAction = async ({ state, effects }) => {
  state.currentModal = 'deployment';

  const zeitIntegration = state.user.integrations.zeit;

  if (!zeitIntegration || !zeitIntegration.token) {
    effects.notificationToast.error(
      'You are not authorized with Zeit, please refresh and log in again'
    );
    return;
  }

  if (!zeitIntegration.email) {
    try {
      const user = await effects.zeit.getUser();

      state.user.integrations.zeit.email = user.email;
    } catch (error) {
      effects.notificationToast.error('Could not authorize with ZEIT');
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

  state.currentModal = null;
  state.deployment.deploysBeingDeleted.push(id);

  try {
    await effects.zeit.deleteDeployment(id);

    effects.notificationToast.success('Deployment deleted');
    actions.deployment.getDeploys();
  } catch (error) {
    effects.notificationToast.error(
      'An unknown error occurred when deleting your deployment'
    );
  }

  state.deployment.deploysBeingDeleted.splice(
    state.deployment.deploysBeingDeleted.indexOf(id),
    1
  );
};

export const aliasDeployment: AsyncAction<{
  id: string;
}> = async ({ state, effects, actions }, { id }) => {
  const zeitConfig = effects.zeit.getConfig(state.editor.currentSandbox);

  try {
    const url = await effects.zeit.aliasDeployment(id, zeitConfig);

    effects.notificationToast.success(`Deployed to ${url}`);
    actions.deployment.getDeploys();
  } catch (error) {
    effects.notificationToast.error(
      'An unknown error occurred when aliasing your deployment'
    );
  }
};
