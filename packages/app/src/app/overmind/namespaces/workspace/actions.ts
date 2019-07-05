import * as internalActions from './internalActions';
import { Action, AsyncAction } from 'app/overmind';
import { Sandbox } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import getTemplate from '@codesandbox/common/lib/templates';

export const internal = internalActions;

export const valueChanged: Action<{
  field: string;
  value: string;
}> = ({ state }, { field, value }) => {
  state.workspace.project[field] = value;
};

export const tagChanged: Action<string> = ({ state }, name) => {
  state.workspace.tags.tagName = name;
};

export const tagAdded: AsyncAction = async ({ state, effects, actions }) => {
  await actions.editor.internal.ensureOwnedEditable();

  const tagName = state.workspace.tags.tagName;
  const sandbox = state.editor.currentSandbox;

  sandbox.tags.push(tagName);

  try {
    sandbox.tags = await effects.api.post(`/sandboxes/${sandbox.id}/tags`, {
      tag: tagName,
    });

    await actions.editor.internal.updateSandboxPackageJson();
  } catch (error) {
    const index = sandbox.tags.indexOf(tagName);
    sandbox.tags.splice(index, 1);
  }
};

export const tagRemoved: AsyncAction<string> = async (
  { state, effects, actions },
  tagName
) => {
  await actions.editor.internal.ensureOwnedEditable();

  const sandbox = state.editor.currentSandbox;
  const tagIndex = sandbox.tags.indexOf(tagName);

  sandbox.tags.splice(tagIndex, 1);

  try {
    sandbox.tags = await effects.api.delete(
      `/sandboxes/${sandbox.id}/tags/${tagName}`
    );

    // Create a "joint action" on this
    const { parsed } = state.editor.parsedConfigurations.package;

    parsed.keywords = sandbox.tags;
    parsed.name = slugify(sandbox.title || sandbox.id);
    parsed.description = sandbox.description;

    const code = JSON.stringify(parsed, null, 2);
    const moduleShortid = state.editor.currentPackageJSON.shortid;

    await actions.editor.internal.saveCode({
      code,
      moduleShortid,
    });
  } catch (error) {
    sandbox.tags.splice(tagIndex, 0, tagName);
  }
};

export const sandboxInfoUpdated: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  await actions.editor.internal.ensureOwnedEditable();

  const sandbox = state.editor.currentSandbox;
  const project = state.workspace.project;

  const hasChangedTitle = project.title && sandbox.title !== project.title;
  const hasChangedDescription =
    project.description && sandbox.description !== project.description;
  const hasChangedAlias = project.alias && sandbox.alias !== project.alias;
  const hasChanged =
    hasChangedTitle || hasChangedDescription || hasChangedAlias;

  if (hasChanged) {
    effects.analytics.track(
      `Sandbox - Update ${
        hasChangedTitle
          ? 'Title'
          : hasChangedDescription
          ? 'Description'
          : 'Alias'
      }`
    );

    sandbox.title = project.title;
    sandbox.description = project.description;
    sandbox.alias = project.alias;

    const updatedSandbox = await effects.api.put<Sandbox>(
      `/sandboxes/${sandbox.id}`,
      {
        sandbox: {
          title: project.title,
          description: project.description,
          alias: project.alias,
        },
      }
    );

    effects.router.updateSandboxUrl(updatedSandbox);

    await actions.editor.internal.updateSandboxPackageJson();
  }
};

export const externalResourceAdded: AsyncAction<string> = async (
  { state, effects, actions },
  resource
) => {
  await actions.editor.internal.ensureOwnedEditable();

  const externalResources = state.editor.currentSandbox.externalResources;

  externalResources.push(resource);

  try {
    await effects.api.post(`/sandboxes/${state.editor.currentId}/resources`, {
      externalResource: resource,
    });
  } catch (error) {
    externalResources.splice(externalResources.indexOf(resource), 1);
    effects.notificationToast.add({
      message: 'Could not save external resource',
      status: NotificationStatus.ERROR,
    });
  }
};

export const externalResourceRemoved: AsyncAction<string> = async (
  { state, effects, actions },
  resource
) => {
  await actions.editor.internal.ensureOwnedEditable();

  const externalResources = state.editor.currentSandbox.externalResources;
  const resourceIndex = externalResources.indexOf(resource);

  externalResources.splice(resourceIndex, 1);

  try {
    await effects.api.request({
      method: 'DELETE',
      url: `/sandboxes/${state.editor.currentId}/resources/`,
      body: {
        id: resource,
      },
    });
  } catch (error) {
    externalResources.splice(resourceIndex, 0, resource);
    effects.notificationToast.add({
      message: 'Could not save removal of external resource',
      status: NotificationStatus.ERROR,
    });
  }
};

export const integrationsOpened: Action = ({ state }) => {
  state.preferences.itemId = 'integrations';
  // I do not think this showModal is used?
  state.preferences.showModal = true;
};

export const sandboxDeleted: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  actions.modalClosed();

  await effects.api.request({
    method: 'DELETE',
    url: `/sandboxes/${state.editor.currentId}`,
    body: {
      id: state.editor.currentId,
    },
  });

  // Not sure if this is in use?
  state.workspace.showDeleteSandboxModal = false;
  effects.notificationToast.add({
    message: 'Sandbox deleted!',
    status: NotificationStatus.SUCCESS,
  });

  effects.router.redirectToSandboxWizard();
};

export const sandboxPrivacyChanged: AsyncAction<0 | 1 | 2> = async (
  { state, effects, actions },
  privacy
) => {
  if (
    getTemplate(state.editor.currentSandbox.template).isServer &&
    privacy === 2
  ) {
    actions.modalOpened({
      modal: 'privacyServerWarning',
      message: null,
    });
  }

  await effects.api.patch(`/sandboxes/${state.editor.currentId}/privacy`, {
    sandbox: {
      privacy: privacy,
    },
  });

  state.editor.currentSandbox.privacy = privacy;
};

export const setWorkspaceItem: Action<string> = ({ state }, item) => {
  state.workspace.openedWorkspaceItem = item;
};

export const toggleCurrentWorkspaceItem: Action = ({ state }) => {
  state.workspace.workspaceHidden = !state.workspace.workspaceHidden;
};

export const setWorkspaceHidden: Action<boolean> = ({ state }, isHidden) => {
  state.workspace.workspaceHidden = isHidden;
};
