import { Action } from 'app/overmind';
import { Sandbox } from '@codesandbox/common/lib/types';
import getItems from './items';

export const configureWorkspace: Action<Sandbox> = ({ state }, sandbox) => {
  state.workspace.project.title = sandbox.title || '';
  state.workspace.project.description = sandbox.description || '';
  state.workspace.project.alias = sandbox.alias || '';

  const items = getItems(state);
  const defaultItem = items.find(i => i.defaultOpen) || items[0];

  state.workspace.openedWorkspaceItem = defaultItem.id;
};
