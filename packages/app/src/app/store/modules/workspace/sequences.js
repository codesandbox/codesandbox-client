import { set, toggle, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { loadSandbox, ensureOwnedSandbox } from '../../sequences';
import { closeTabByIndex } from '../../actions';
import { addNotification, setCurrentModule } from '../../factories';

export const openSearchDependenciesModal = set(
  state`workspace.showSearchDependenciesModal`,
  true
);

export const closeSearchDependenciesModal = set(
  state`workspace.showSearchDependenciesModal`,
  false
);

export const openDeleteSandboxModal = set(
  state`workspace.showDeleteSandboxModal`,
  true
);

export const closeDeleteSandboxModal = set(
  state`workspace.showDeleteSandboxModal`,
  false
);

export const changeSandboxPrivacy = [
  actions.saveSandboxPrivacy,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.privacy`,
    props`privacy`
  ),
];

export const deleteSandbox = [
  actions.deleteSandbox,
  set(state`workspace.showDeleteSandboxModal`, false),
  addNotification('Sandbox deleted!', 'success'),
  actions.redirectToNewSandbox,
  set(props`id`, 'new'),
  loadSandbox,
];

export const openIntegrations = [
  set(state`preferences.itemIndex`, 4),
  set(state`preferences.showModal`, true),
];

export const changeValue = [
  set(state`workspace.project.${props`field`}`, props`value`),
];

export const updateSandboxInfo = [
  ensureOwnedSandbox,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.title`,
    state`workspace.project.title`
  ),
  set(
    state`editor.sandboxes.${state`editor.currentId`}.description`,
    state`workspace.project.description`
  ),
  actions.updateSandbox,
];

export const toggleWorkspace = toggle(state`workspace.isWorkspaceHidden`);

export const removeNpmDependency = [
  ensureOwnedSandbox,
  set(state`workspace.isProcessingDependencies`, true),
  actions.removeNpmDependency,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.npmDependencies`,
    props`npmDependencies`
  ),
  set(state`workspace.isProcessingDependencies`, false),
];

export const addExternalResource = [
  ensureOwnedSandbox,
  set(state`workspace.isProcessingDependencies`, true),
  actions.addExternalResource,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
    props`externalResources`
  ),
  set(state`workspace.isProcessingDependencies`, false),
];

export const removeExternalResource = [
  ensureOwnedSandbox,
  set(state`workspace.isProcessingDependencies`, true),
  actions.removeExternalResource,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.externalResources`,
    props`externalResources`
  ),
  set(state`workspace.isProcessingDependencies`, false),
];

export const deleteModule = [
  ensureOwnedSandbox,
  actions.whenModuleIsSelected,
  {
    true: setCurrentModule(state`editor.mainModule.id`),
    false: [],
  },
  actions.whenCloseTab,
  {
    true: closeTabByIndex,
    false: [],
  },
  actions.removeModule,
  actions.deleteModule,
  {
    success: [],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.modules`,
        props`removedModule`
      ),
      addNotification('Could not delete file', 'error'),
    ],
  },
];

export const createModule = [
  ensureOwnedSandbox,
  actions.createOptimisticModule,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.modules`,
    props`optimisticModule`
  ),
  actions.saveNewModule,
  {
    success: [
      actions.updateOptimisticModule,
      setCurrentModule(props`newModule.id`),
    ],
    error: [
      actions.removeOptimisticModule,
      setCurrentModule(state`editor.mainModule.shortid.id`),
      addNotification('Unable to save new file', 'error'),
    ],
  },
];

export const renameModule = [
  ensureOwnedSandbox,
  actions.saveNewModuleName,
  actions.renameModule,
];

export const createDirectory = [
  ensureOwnedSandbox,
  actions.createOptimisticDirectory,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.directories`,
    props`optimisticDirectory`
  ),
  actions.saveDirectory,
  {
    success: actions.updateOptimisticDirectory,
    error: [
      actions.removeOptimisticDirectory,
      addNotification('Unable to save new directory', 'error'),
    ],
  },
];

export const renameDirectory = [
  ensureOwnedSandbox,
  actions.saveNewDirectoryName,
  actions.renameDirectory,
];

export const deleteDirectory = [
  ensureOwnedSandbox,
  set(state`editor.currentModuleShortid`, state`editor.mainModule.shortid`),
  actions.removeDirectory,
  actions.deleteDirectory,
  {
    success: [],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.directories`,
        props`removedDirectory`
      ),
      addNotification('Could not delete directory', 'error'),
    ],
  },
];

export const moveDirectoryToDirectory = [
  actions.moveDirectoryToDirectory,
  actions.saveNewDirectoryDirectoryShortid,
  {
    success: [],
    error: [
      actions.revertMoveDirectoryToDirectory,
      addNotification('Could not save new directory location', 'error'),
    ],
  },
];

export const moveModuleToDirectory = [
  actions.moveModuleToDirectory,
  actions.saveNewModuleDirectoryShortid,
  {
    success: [],
    error: [
      actions.revertMoveModuleToDirectory,
      addNotification('Could not save new module location', 'error'),
    ],
  },
];

export const updateTag = [set(state`workspace.tags.tagName`, props`tagName`)];

export const addTag = [
  ensureOwnedSandbox,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.tags`,
    state`workspace.tags.tagName`
  ),
  actions.addTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`data`),
  set(state`workspace.tags.tagName`, ''),
];

export const removeTag = [
  ensureOwnedSandbox,
  actions.removeTagFromState,
  actions.removeTag,
  set(state`editor.sandboxes.${state`editor.currentId`}.tags`, props`tags`),
];
