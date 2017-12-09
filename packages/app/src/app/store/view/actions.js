export const SET_DEV_TOOLS_OPEN = 'SET_DEV_TOOLS_OPEN';
export const SET_WORKSPACE_HIDDEN = 'SET_WORKSPACE_HIDDEN';
export const SET_QUICK_ACTIONS_OPEN = 'SET_QUICK_ACTIONS_OPEN';

const setDevToolsOpen = (open: boolean) => ({
  type: SET_DEV_TOOLS_OPEN,
  open,
});

const setWorkspaceHidden = (workspaceHidden: boolean) => ({
  type: SET_WORKSPACE_HIDDEN,
  workspaceHidden,
});

const setQuickActionsOpen = (open: boolean) => ({
  type: SET_QUICK_ACTIONS_OPEN,
  open,
});

export default {
  setDevToolsOpen,
  setWorkspaceHidden,
  setQuickActionsOpen,
};
