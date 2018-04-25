import { push, set, concat } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { ensureOwnedSandbox, closeModal } from '../../sequences';
import { setCurrentModule, addNotification } from '../../factories';
import { closeTabByIndex, setModal } from '../../actions';
import {
  sendModuleCreated,
  sendModuleDeleted,
  sendModuleUpdated,
  sendMassModuleCreated,
  sendDirectoryCreated,
  sendDirectoryDeleted,
  sendDirectoryUpdated,
} from '../live/actions';
import * as actions from './actions';

export const getUploadedFiles = [
  set(props`modal`, 'storageManagement'),
  setModal,
  actions.getUploadedFiles,
  {
    success: [
      set(state`uploadedFiles`, props`uploadedFilesInfo.uploads`),
      set(state`maxStorage`, props`uploadedFilesInfo.maxSize`),
      set(state`usedStorage`, props`uploadedFilesInfo.currentSize`),
    ],
    error: [
      addNotification('Unable to get uploaded files information', 'error'),
    ],
  },
];

export const removeModule = [
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
];

export const massCreateModules = [
  ensureOwnedSandbox,
  actions.massCreateModules,
  {
    success: [
      concat(state`editor.currentSandbox.modules`, props`modules`),
      concat(state`editor.currentSandbox.directories`, props`directories`),
      sendMassModuleCreated,
    ],
    error: [],
  },
];

export const deleteUploadedFile = [
  actions.deleteUploadedFile,
  {
    success: [set(state`uploadedFiles`, null), getUploadedFiles],
    error: [addNotification('Unable to delete uploaded file', 'error')],
  },
];

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
      set(props`moduleShortid`, props`newModule.shortid`),
      sendModuleCreated,
    ],
    error: [
      set(props`moduleShortid`, props`optimisticModule.shortid`),
      removeModule,
      setCurrentModule(state`editor.mainModule.shortid.id`),
      addNotification('Unable to save new file', 'error'),
    ],
  },
];

export const addFileToSandbox = [
  set(props`newCode`, props`url`),
  set(props`title`, props`name`),
  set(props`isBinary`, true),
  closeModal,
  createModule,
];

export const uploadFiles = [
  set(props`modal`, 'uploading'),
  setModal,
  actions.uploadFiles,
  {
    success: [set(state`uploadedFiles`, null), massCreateModules],
    error: [addNotification(props`error`, 'error')],
  },
  closeModal,
];

export const renameModule = [
  ensureOwnedSandbox,
  actions.renameModule,
  actions.saveNewModuleName,
  {
    success: [sendModuleUpdated],
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
    success: [sendDirectoryUpdated],
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
    success: [
      actions.updateOptimisticDirectory,
      set(props`directoryShortid`, props`newDirectory.shortid`),
      sendDirectoryCreated,
    ],
    error: [
      actions.removeOptimisticDirectory,
      addNotification('Unable to save new directory', 'error'),
    ],
  },
];

export const removeDirectory = [
  set(state`editor.currentModuleShortid`, state`editor.mainModule.shortid`),
  actions.removeDirectory,
];

export const deleteDirectory = [
  ensureOwnedSandbox,
  removeDirectory,
  actions.deleteDirectory,
  {
    success: [sendDirectoryDeleted],
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
  ensureOwnedSandbox,
  actions.moveDirectoryToDirectory,
  actions.saveNewDirectoryDirectoryShortid,
  {
    success: [
      set(props`directoryShortid`, props`shortid`),
      sendDirectoryUpdated,
    ],
    error: [
      actions.revertMoveDirectoryToDirectory,
      addNotification('Could not save new directory location', 'error'),
    ],
  },
];

export const moveModuleToDirectory = [
  ensureOwnedSandbox,
  actions.moveModuleToDirectory,
  actions.saveNewModuleDirectoryShortid,
  {
    success: [sendModuleUpdated],
    error: [
      actions.revertMoveModuleToDirectory,
      addNotification('Could not save new module location', 'error'),
    ],
  },
];

export const deleteModule = [
  removeModule,
  actions.deleteModule,
  {
    success: [sendModuleDeleted],
    error: [
      push(
        state`editor.sandboxes.${state`editor.currentId`}.modules`,
        props`removedModule`
      ),
      addNotification('Could not delete file', 'error'),
    ],
  },
];
