export const SET_DEV_TOOLS_OPEN = 'SET_DEV_TOOLS_OPEN';
export const SET_WORKSPACE_HIDDEN = 'SET_WORKSPACE_HIDDEN';

const setDevToolsOpen = (open: boolean) => ({
  type: SET_DEV_TOOLS_OPEN,
  open,
});

const setWorkspaceHidden = (workspaceHidden: boolean) => ({
  type: SET_WORKSPACE_HIDDEN,
  workspaceHidden,
});

export default {
  setDevToolsOpen,
  setWorkspaceHidden,
};
