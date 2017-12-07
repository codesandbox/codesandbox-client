import { set, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

const forkSandbox = [
  actions.forkSandbox,
  actions.moveModuleContent,
  set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
  set(state`editor.currentId`, props`sandbox.id`),
];

export const loadSandbox = [
  when(state`editor.sandboxes.${props`id`}`),
  {
    true: set(state`editor.currentId`, props`id`),
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      actions.getSandbox,
      {
        success: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          set(state`editor.currentId`, props`sandbox.id`),
          actions.setCurrentModuleId,
        ],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
      set(state`editor.isLoading`, false),
    ],
  },
];

export const onUnload = actions.warnUnloadingContent;

export const startResizing = set(state`editor.isResizing`, true);

export const stopResizing = set(state`editor.isResizing`, false);

export const saveCode = [
  when(state`editor.currentSandbox.owner`),
  {
    true: [],
    false: forkSandbox,
  },
];

export const changeCode = actions.setCode;
