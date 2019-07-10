import { Action, AsyncAction } from 'app/overmind';
import * as internalActions from './internalActions';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { NetlifyBaseURL } from 'app/overmind/constants';
import { NetlifySite } from './state';

export const internal = internalActions;

export const deployWithNetlify: AsyncAction = async ({
  effects,
  state,
  actions,
}) => {
  state.deployment.deploying = true;
  const zip = await actions.deployment.internal.createZip();
  try {
    const id = await actions.deployment.internal.deployToNetlify(zip.file);
    state.deployment.deploying = false;
    // Does not seem that we use this thing? Not in other code either
    // const deploys = await actions.deployment.internal.getNetlifyDeploys();
    state.deployment.building = true;
    await actions.deployment.internal.getStatus(id);
    effects.notificationToast.add({
      message: 'Sandbox Deployed',
      status: NotificationStatus.SUCCESS,
    });
    state.deployment.building = false;
  } catch (error) {
    state.deployment.deploying = false;
    state.deployment.building = false;
    effects.notificationToast.add({
      message: 'An unknown error occurred when deploying your site',
      status: NotificationStatus.ERROR,
    });
  }
};

export const getNetlifyDeploys: AsyncAction = async ({ state, actions }) => {
  // We are not using the claim for anything?
  // const claim = await actions.deployment.internal.claimNetlifyWebsite();
  try {
    state.deployment.netlifySite = await actions.deployment.internal.getNetlifyDeploys();
  } catch (error) {
    state.deployment.netlifySite = null;
  }
};

export const getDeploys: AsyncAction = async ({ state, effects, actions }) => {
  state.deployment.gettingDeploys = true;

  const deploymentData = await actions.deployment.internal.getDeploymentData();

  try {
    state.deployment.sandboxDeploys = await actions.deployment.internal.getDeploys(
      deploymentData
    );
  } catch (error) {
    effects.notificationToast.add({
      message: 'An unknown error occurred when connecting to Zite',
      status: NotificationStatus.ERROR,
    });
  }

  state.deployment.gettingDeploys = false;
};

export const deployClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  state.deployment.deploying = true;
  const file = await actions.deployment.internal.createZip();
  const contents = await effects.jsZip.loadAsync(file);
  const apiData = await actions.deployment.internal.createApiData(contents);

  try {
    state.deployment.url = await actions.deployment.internal.postToZeit(
      apiData
    );
  } catch (error) {
    effects.notificationToast.add({
      message: 'An unknown error occurred when connecting to Zite',
      status: NotificationStatus.ERROR,
    });
  }

  state.deployment.deploying = false;

  actions.deployment.getDeploys();
};

export const deploySandboxClicked: AsyncAction = async ({ state, actions }) => {
  state.currentModal = 'deployment';
  await actions.internal.getZeitUserDetails();
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

  state.currentModal = null;
  state.deployment.isDeletingDeployment = true;

  try {
    await actions.deployment.internal.deleteDeployment(id);

    effects.notificationToast.add({
      message: 'Deployment deleted',
      status: NotificationStatus.SUCCESS,
    });

    actions.deployment.getDeploys();
  } catch (error) {
    effects.notificationToast.add({
      message: 'An unknown error occurred when deleting your deployment',
      status: NotificationStatus.ERROR,
    });
  }

  state.deployment.isDeletingDeployment = false;
};

export const aliasDeployment: AsyncAction<string> = async (
  { effects, actions },
  id
) => {
  const deploymentData = await actions.deployment.internal.getDeploymentData();

  try {
    const url = await actions.deployment.internal.aliasDeployment({
      id,
      nowData: deploymentData,
    });

    effects.notificationToast.add({
      message: `Deployed to ${url}`,
      status: NotificationStatus.SUCCESS,
    });
  } catch (error) {
    effects.notificationToast.add({
      message: 'An unknown error occurred when aliasing your deployment',
      status: NotificationStatus.ERROR,
    });
  }
};
