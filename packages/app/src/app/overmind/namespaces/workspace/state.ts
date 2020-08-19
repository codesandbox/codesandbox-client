import { Dependency } from '@codesandbox/common/lib/types/algolia';

type State = {
  project: {
    title: string;
    description: string;
    alias: string;
  };
  tags: {
    tagName: string;
  };
  openedWorkspaceItem: string | null;
  workspaceHidden: boolean;
  showDeleteSandboxModal: boolean;
  dependencies: Dependency[];
  starterDependencies: Dependency[];
  selectedDependencies:
    | {
        [a: string]: Dependency;
      }
    | {};
  loadingDependencySearch: boolean;
  hitToVersionMap: Map<any, any>;
  showingSelectedDependencies: boolean;
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
  dependencies: [],
  starterDependencies: [],
  selectedDependencies: {},
  loadingDependencySearch: false,
  hitToVersionMap: new Map(),
  showingSelectedDependencies: false,
};
