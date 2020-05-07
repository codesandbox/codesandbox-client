import {
  GitCommit,
  GitFileCompare,
  GitPathChanges,
  GitPr,
  Module,
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
  commit: GitCommit | null;
  pr: GitPr | null;
  isCommitting: boolean;
  isCreatingPr: boolean;
  gitChanges: GitPathChanges;
  sourceGitChanges: {
    [path: string]: GitFileCompare;
  };
  sourceModulesByPath: { [path: string]: Module };
  permission: 'admin' | 'write' | 'read';
};

export const state: State = {
  gitState: SandboxGitState.SYNCING,
  repoTitle: '',
  sourceSandboxId: null,
  error: null,
  isExported: false,
  showExportedModal: false,
  isFetching: false,
  title: '',
  description: '',
  commit: null,
  pr: null,
  isCommitting: false,
  isCreatingPr: false,
  permission: 'read',
  sourceModulesByPath: {},
  gitChanges: {
    added: [],
    deleted: [],
    modified: [],
  },
  sourceGitChanges: {},
};
