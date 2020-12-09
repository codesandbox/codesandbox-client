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
  sourceModulesByPath: {
    [path: string]: {
      code: string;
      isBinary: boolean;
      uploadId?: string;
      sha?: string;
    };
  };
  permission: 'admin' | 'write' | 'read';
  conflictsResolving: string[];
  outOfSyncUpdates: {
    added: GitFileCompare[];
    deleted: GitFileCompare[];
    modified: GitFileCompare[];
  };
  // Rename source to original
  sourceCommitSha: string | null;
  baseCommitSha: string | null;
  isResolving: boolean;
  isLinkingToGitSandbox: boolean;
};

export const state: State = {
  gitState: SandboxGitState.SYNCING,
  sourceCommitSha: null,
  baseCommitSha: null,
  repoTitle: '',
  sourceSandboxId: null,
  error: null,
  isExported: false,
  showExportedModal: false,
  isFetching: false,
  title: '',
  description: '',
  pr: null,
  isCommitting: false,
  isCreatingPr: false,
  isResolving: false,
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
  outOfSyncUpdates: {
    added: [],
    deleted: [],
    modified: [],
  },
  isLinkingToGitSandbox: false,
};
