import {
  GitFileCompare,
  GitPathChanges,
  GitPr,
  SandboxGitState,
} from '@codesandbox/common/lib/types';

type State = {
  gitState: SandboxGitState;
  repoTitle: string;
  sourceSandboxId: string | null;
  error: string | null;
  isExported: boolean;
  showExportedModal: boolean;
  isFetching: boolean;
  title: string;
  description: string;
  pr: GitPr | null;
  isCommitting: boolean;
  isCreatingPr: boolean;
  conflicts: GitFileCompare[];
  gitChanges: GitPathChanges;
  sourceGitChanges: {
    [path: string]: GitFileCompare;
  };
  sourceModulesByPath: { [path: string]: string };
  permission: 'admin' | 'write' | 'read';
  conflictsResolving: string[];
};

export const state: State = {
  gitState: SandboxGitState.SYNCING,
  repoTitle: '',
  sourceSandboxId: null,
  error: null,
  isExported: false,
  showExportedModal: false,
  isFetching: true,
  title: '',
  description: '',
  pr: null,
  isCommitting: false,
  isCreatingPr: false,
  permission: 'read',
  sourceModulesByPath: {},
  conflicts: [],
  gitChanges: {
    added: [],
    deleted: [],
    modified: [],
  },
  sourceGitChanges: {},
  conflictsResolving: [],
};
