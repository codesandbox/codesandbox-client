type State = {
  project: {
    title: string;
    description: string;
    alias: string;
  };
  tags: {
    tagName: string;
  };
  openedWorkspaceItem: string;
  workspaceHidden: boolean;
  showDeleteSandboxModal: boolean;
};

export const state: State = {
  project: {
    title: '',
    description: '',
    alias: '',
  },
  tags: {
    tagName: '',
  },
  openedWorkspaceItem: null,
  workspaceHidden: false,
  showDeleteSandboxModal: false,
};
