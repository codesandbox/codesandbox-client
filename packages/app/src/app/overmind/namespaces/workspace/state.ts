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
  explorerDependencies: Dependency[];
  explorerDependenciesEmpty: boolean;
  selectedDependencies:
    | {
        [a: string]: Dependency;
      }
    | {};
  loadingDependencySearch: boolean;
  hitToVersionMap: {
    [name: string]: string;
  };
  showingSelectedDependencies: boolean;
  dependencySearch: string;
};

export const state: State = {
  project: {
    title: '',
    description: '',
    alias: ''
  },
  tags: {
    tagName: ''
  },
  openedWorkspaceItem: null,
  workspaceHidden: false,
  showDeleteSandboxModal: false,
  dependencies: [],
  explorerDependencies: [],
  explorerDependenciesEmpty: false,
  starterDependencies: [],
  selectedDependencies: {},
  loadingDependencySearch: false,
  hitToVersionMap: {},
  showingSelectedDependencies: false,
  dependencySearch: ''
};
