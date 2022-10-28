import getTemplate from '@codesandbox/common/lib/templates';
import { Dependency } from '@codesandbox/common/lib/types/algolia';
import { CustomTemplate } from '@codesandbox/common/lib/types';
import track from '@codesandbox/common/lib/utils/analytics';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { Context } from 'app/overmind';
import { withOwnedSandbox } from 'app/overmind/factories';
import getItems from 'app/overmind/utils/items';
import { json } from 'overmind';
import { SearchResults } from './state';

export const valueChanged = (
  { state }: Context,
  {
    field,
    value,
  }: {
    field: string;
    value: string;
  }
) => {
  state.workspace.project[field] = value;
};

export const tagChanged = ({ state }: Context, tagName: string) => {
  state.workspace.tags.tagName = tagName;
};

export const tagAdded = withOwnedSandbox(
  async ({ state, effects, actions }: Context) => {
    const { tagName } = state.workspace.tags;
    const sandbox = state.editor.currentSandbox;

    if (!sandbox) {
      return;
    }

    const cleanTag = tagName.replace(/#/g, '');

    sandbox.tags.push(cleanTag);

    try {
      sandbox.tags = await effects.api.createTag(sandbox.id, cleanTag);

      await actions.editor.internal.updateSandboxPackageJson();
    } catch (error) {
      const index = sandbox.tags.indexOf(cleanTag);
      sandbox.tags.splice(index, 1);
      actions.internal.handleError({ message: 'Unable to add tag', error });
    }
  }
);

export const tagRemoved = withOwnedSandbox(
  async ({ state, effects, actions }: Context, tag: string) => {
    const sandbox = state.editor.currentSandbox;

    if (!sandbox) {
      return;
    }

    const tagIndex = sandbox.tags.indexOf(tag);

    sandbox.tags.splice(tagIndex, 1);

    try {
      sandbox.tags = await effects.api.deleteTag(sandbox.id, tag);

      if (
        !state.editor.parsedConfigurations ||
        !state.editor.currentPackageJSON
      ) {
        return;
      }
      // Create a "joint action" on this
      if (!state.editor.parsedConfigurations.package) {
        return;
      }
      const { parsed } = state.editor.parsedConfigurations.package;

      if (!parsed) {
        return;
      }

      parsed.keywords = sandbox.tags;
      parsed.name = slugify(sandbox.title || sandbox.id);
      parsed.description = sandbox.description;

      const code = JSON.stringify(parsed, null, 2);
      const moduleShortid = state.editor.currentPackageJSON.shortid;

      await actions.editor.codeSaved({
        code,
        moduleShortid,
        cbID: null,
      });
    } catch (error) {
      sandbox.tags.splice(tagIndex, 0, tag);
      actions.internal.handleError({ message: 'Unable to remove tag', error });
    }
  }
);

export const tagsChanged = async (
  { actions, effects, state }: Context,
  {
    newTags,
    removedTags,
  }: {
    newTags: string[];
    removedTags: string[];
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const { tags } = state.editor.currentSandbox;
  if (tags.length > 5) {
    effects.notificationToast.error('You can have a maximum of 5 tags');
    return;
  }

  const tagWasRemoved =
    newTags.length < tags.length && removedTags.length === 1;
  if (tagWasRemoved) {
    removedTags.forEach(actions.workspace.tagRemoved);
    return;
  }

  await actions.workspace.tagAdded();
};

/** tagsChanged2 takes new tags and does the diffing on its own
 * This is v2 of tagsChanged. It's used in the redesign
 */
export const tagsChanged2 = withOwnedSandbox(
  async ({ state, effects, actions }: Context, newTags: string[]) => {
    const sandbox = state.editor.currentSandbox;
    if (!sandbox) return;

    const { tags: oldTags } = sandbox;

    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));

    removedTags.forEach(actions.workspace.tagRemoved);

    addedTags.forEach(async tag => {
      const cleanTag = tag.replace(/#/g, '');

      // use old methods to update tags
      actions.workspace.tagChanged(cleanTag);
      await actions.workspace.tagAdded();
    });
  }
);

export const sandboxInfoUpdated = withOwnedSandbox(
  async ({ state, effects, actions }: Context) => {
    const sandbox = state.editor.currentSandbox;
    if (!sandbox) {
      return;
    }
    const { project } = state.workspace;
    const hasChangedTitle =
      project.title.trim() && sandbox.title !== project.title;
    const hasChangedDescription =
      project.description.trim() && sandbox.description !== project.description;
    const hasChangedAlias = project.alias && sandbox.alias !== project.alias;
    const hasChanged =
      hasChangedTitle || hasChangedDescription || hasChangedAlias;

    if (hasChanged) {
      try {
        let event = 'Alias';

        if (hasChangedTitle) {
          event = 'Title';
        } else if (hasChangedDescription) {
          event = 'Description';
        }

        effects.analytics.track(`Sandbox - Update ${event}`);

        sandbox.title = project.title;
        sandbox.description = project.description;
        sandbox.alias = project.alias;

        const updatedSandbox = await effects.api.updateSandbox(sandbox.id, {
          title: project.title,
          description: project.description,
          alias: project.alias,
        });

        if (!updatedSandbox) {
          effects.notificationToast.error('Could not update Sandbox');
          return;
        }

        effects.router.replaceSandboxUrl(updatedSandbox);

        await actions.editor.internal.updateSandboxPackageJson();
      } catch (error) {
        actions.internal.handleError({
          message:
            'We were not able to save your sandbox updates, please try again',
          error,
        });
      }
    }
  }
);

export const externalResourceAdded = withOwnedSandbox(
  async ({ effects, state, actions }: Context, resource: string) => {
    if (!state.editor.currentSandbox) {
      return;
    }
    const { externalResources } = state.editor.currentSandbox;

    externalResources.push(resource);
    actions.editor.internal.updatePreviewCode();

    try {
      await effects.api.createResource(
        state.editor.currentSandbox.id,
        resource
      );
      if (state.live.isLive) {
        effects.live.sendExternalResourcesChanged(
          state.editor.currentSandbox.externalResources
        );
      }
    } catch (error) {
      externalResources.splice(externalResources.indexOf(resource), 1);
      actions.internal.handleError({
        message: 'Could not save external resource',
        error,
      });
      actions.editor.internal.updatePreviewCode();
    }
  }
);

export const externalResourceRemoved = withOwnedSandbox(
  async ({ effects, state, actions }: Context, resource: string) => {
    if (!state.editor.currentSandbox) {
      return;
    }

    const { externalResources } = state.editor.currentSandbox;
    const resourceIndex = externalResources.indexOf(resource);

    externalResources.splice(resourceIndex, 1);
    actions.editor.internal.updatePreviewCode();

    try {
      await effects.api.deleteResource(
        state.editor.currentSandbox.id,
        resource
      );
      if (state.live.isLive) {
        effects.live.sendExternalResourcesChanged(
          state.editor.currentSandbox.externalResources
        );
      }
    } catch (error) {
      externalResources.splice(resourceIndex, 0, resource);

      actions.internal.handleError({
        message: 'Could not save removal of external resource',
        error,
      });
      actions.editor.internal.updatePreviewCode();
    }
  }
);

export const integrationsOpened = ({ state }: Context) => {
  state.preferences.itemId = 'integrations';
  // I do not think this showModal is used?
  state.preferences.showModal = true;
};

export const sandboxDeleted = async ({ state, effects, actions }: Context) => {
  actions.modalClosed();

  if (!state.editor.currentSandbox) {
    return;
  }

  await effects.api.deleteSandbox(state.editor.currentSandbox.id);

  // Not sure if this is in use?
  state.workspace.showDeleteSandboxModal = false;
  effects.notificationToast.success('Sandbox deleted!');

  effects.router.redirectToSandboxWizard();
};

export const sandboxPrivacyChanged = async (
  { actions, effects, state }: Context,
  {
    privacy,
    source = 'generic',
  }: {
    privacy: 0 | 1 | 2;
    source?: string;
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  track('Sandbox - Update Privacy', {
    privacy,
    source,
  });

  const oldPrivacy = state.editor.currentSandbox.privacy;
  state.editor.currentSandbox.privacy = privacy;

  try {
    const sandbox = await effects.api.updatePrivacy(
      state.editor.currentSandbox.id,
      privacy
    );
    state.editor.currentSandbox.previewSecret = sandbox.previewSecret;
    state.editor.currentSandbox.privacy = privacy;

    if (
      getTemplate(state.editor.currentSandbox.template).isServer &&
      ((oldPrivacy !== 2 && privacy === 2) ||
        (oldPrivacy === 2 && privacy !== 2))
    ) {
      // Privacy changed from private to unlisted/public or other way around, restart
      // the sandbox to notify containers
      actions.server.restartContainer();
    }
  } catch (error) {
    state.editor.currentSandbox.privacy = oldPrivacy;
    actions.internal.handleError({
      message: "We weren't able to update the sandbox privacy",
      error,
    });
  }
};

export const setWorkspaceItem = (
  { state, effects }: Context,
  {
    item,
  }: {
    item: string;
  }
) => {
  effects.analytics.track('Sidebar - Changed Workspace Item', { item });
  state.workspace.openedWorkspaceItem = item;
};

export const toggleCurrentWorkspaceItem = ({ state }: Context) => {
  state.workspace.workspaceHidden = !state.workspace.workspaceHidden;
};

export const setWorkspaceHidden = (
  { state, effects }: Context,
  { hidden }: { hidden: boolean }
) => {
  effects.analytics.track('Sidebar - Set Visibility', { hidden });

  state.workspace.workspaceHidden = hidden;
  effects.vscode.resetLayout();
};

export const deleteTemplate = async ({ state, actions, effects }: Context) => {
  effects.analytics.track('Template - Removed', { source: 'editor' });
  if (
    !state.editor.currentSandbox ||
    !state.editor.currentSandbox.customTemplate
  ) {
    return;
  }
  const sandbox = state.editor.currentSandbox;
  const templateId = state.editor.currentSandbox.customTemplate.id;

  try {
    await effects.api.deleteTemplate(sandbox.id, templateId);

    sandbox.isFrozen = false;
    sandbox.customTemplate = null;
    actions.modalClosed();
    effects.notificationToast.success('Template Deleted');
  } catch (error) {
    actions.internal.handleError({
      message: 'Could not delete custom template',
      error,
    });
  }
};

export const editTemplate = async (
  { state, actions, effects }: Context,
  template: CustomTemplate
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  effects.analytics.track('Template - Edited', { source: 'editor' });

  const sandboxId = state.editor.currentSandbox.id;

  try {
    const updatedTemplate = await effects.api.updateTemplate(
      sandboxId,
      template
    );

    actions.modalClosed();
    state.editor.currentSandbox.customTemplate = updatedTemplate;
    effects.notificationToast.success('Template Edited');
  } catch (error) {
    actions.internal.handleError({
      message: 'Could not edit custom template',
      error,
    });
  }
};

export const addedTemplate = async (
  { state, actions, effects }: Context,
  template: {
    color: string;
    description: string;
    title: string;
  }
) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  effects.analytics.track('Template - Created', { source: 'editor' });

  const sandboxId = state.editor.currentSandbox.id;

  try {
    const newTemplate = await effects.api.createTemplate(sandboxId, template);
    const sandbox = state.editor.currentSandbox;
    sandbox.isFrozen = true;
    sandbox.customTemplate = newTemplate;
    actions.modalClosed();
    effects.notificationToast.success('Successfully created the template');
  } catch (error) {
    actions.internal.handleError({
      message: 'Could not create template, please try again later',
      error,
    });
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }
};

export const openDefaultItem = ({ state }: Context) => {
  const items = getItems(state);
  const defaultItem = items.find(i => i.defaultOpen) || items[0];

  state.workspace.openedWorkspaceItem = defaultItem.id;
};

export const changeDependencySearch = ({ state }: Context, value: string) => {
  state.workspace.dependencySearch = value;
};

export const getExplorerDependencies = async (
  { state, effects }: Context,
  value: string
) => {
  state.workspace.explorerDependenciesEmpty = false;
  if (!value) {
    state.workspace.explorerDependencies = [];
    return;
  }
  state.workspace.loadingDependencySearch = true;
  const searchResults = await effects.algoliaSearch.searchDependencies(
    value,
    4
  );

  state.workspace.loadingDependencySearch = false;
  if (searchResults.length) {
    state.workspace.explorerDependencies = searchResults;
  } else {
    state.workspace.explorerDependenciesEmpty = true;
  }
};

export const clearExplorerDependencies = ({ state }: Context) => {
  state.workspace.explorerDependencies = [];
};

export const getDependencies = async (
  { state, effects }: Context,
  value: string
) => {
  state.workspace.loadingDependencySearch = true;
  const searchResults = await effects.algoliaSearch.searchDependencies(value);

  state.workspace.loadingDependencySearch = false;
  state.workspace.dependencies = searchResults;
};

export const setSelectedDependencies = (
  { state }: Context,
  dependency: Dependency
) => {
  const selectedDependencies = state.workspace.selectedDependencies;
  const versionMap = state.workspace.hitToVersionMap;
  const dep = json(dependency);

  if (selectedDependencies[dep.objectID]) {
    delete selectedDependencies[dep.objectID];
    delete versionMap[dep.objectID];
  } else {
    selectedDependencies[dep.objectID] = dep;
  }
};

export const handleVersionChange = (
  { state }: Context,
  {
    dependency,
    version,
  }: {
    dependency: Dependency;
    version: string;
  }
) => {
  if (state.editor.parsedConfigurations?.package?.parsed?.dependencies) {
    const installedVersion =
      state.editor.parsedConfigurations.package.parsed.dependencies[
        dependency.objectID
      ];

    /* Remove the dependency as the same version is already installed */
    if (installedVersion === version) {
      const selectedDependencies = state.workspace.selectedDependencies;
      const versionMap = state.workspace.hitToVersionMap;
      delete selectedDependencies[dependency.objectID];
      delete versionMap[dependency.objectID];
      return;
    }
  }
  state.workspace.hitToVersionMap[dependency.objectID] = version;
};

export const clearSelectedDependencies = ({ state }: Context) => {
  state.workspace.selectedDependencies = {};
};

export const toggleShowingSelectedDependencies = ({ state }: Context) => {
  state.workspace.showingSelectedDependencies = !state.workspace
    .showingSelectedDependencies;
};

export const searchValueChanged = ({ state }: Context, value: string) => {
  state.workspace.searchValue = value;
};

export const filesToIncludeChanged = ({ state }: Context, value: string) => {
  state.workspace.searchOptions.filesToInclude = value;
};

export const filesToExcludeChanged = ({ state }: Context, value: string) => {
  state.workspace.searchOptions.filesToExclude = value;
};

export const openResult = ({ state }: Context, id: number) => {
  state.workspace.searchResults[id].open = !state.workspace.searchResults[id]
    .open;
};

export const searchResultsChanged = (
  { state }: Context,
  results: SearchResults
) => {
  state.workspace.searchResults = results;
};

export const searchOptionsToggled = ({ state }: Context, option: string) => {
  state.workspace.searchOptions[option] = !state.workspace.searchOptions[
    option
  ];
};

export const toggleEditingSandboxInfo = (
  { state }: Context,
  value: boolean
) => {
  state.workspace.editingSandboxInfo = value;
};
