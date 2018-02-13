import { push, set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { ensureOwnedSandbox } from '../../sequences';
import { setCurrentModule, addNotification } from '../../factories';
import { closeTabByIndex } from '../../actions';
import * as actions from './actions';

export const createModule = [
  ensureOwnedSandbox,
  actions.createOptimisticModule,
  push(
    state`editor.sandboxes.${state`editor.currentId`}.modules`,
    props`optimisticModule`
  ),
  actions.setDefaultNewCode,
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
  actions.renameModule,
  actions.saveNewModuleName,
  {
    success: [],
    error: [
      actions.revertModuleName,
      addNotification('Could not rename file', 'error'),
    ],
  },
];

export const renameDirectory = [
  ensureOwnedSandbox,
  actions.renameDirectory,
  actions.saveNewDirectoryName,
  {
    success: [],
    error: [
      actions.revertDirectoryName,
      addNotification('Could not rename file', 'error'),
    ],
  },
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
