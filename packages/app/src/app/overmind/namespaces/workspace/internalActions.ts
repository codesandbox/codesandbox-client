import { Action } from 'app/overmind';
import getItems from './items';
import { Sandbox } from '@codesandbox/common/lib/types';

export const setWorkspace: Action<Sandbox> = ({ state }, sandbox) => {
  state.workspace.project.title = sandbox.title || '';
  state.workspace.project.description = sandbox.description || '';
  state.workspace.project.alias = sandbox.alias || '';

  const items = getItems(state);
  const defaultItem = items.find(i => i.defaultOpen) || items[0];

  state.workspace.openedWorkspaceItem = defaultItem.id;
};
