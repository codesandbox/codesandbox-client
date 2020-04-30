import {
  GitChanges,
  GitCommit,
  GitFileCompare,
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
  subject: string;
  description: string;
  commit: GitCommit | null;
  pr: GitPr | null;
  isCommitting: boolean;
  isCreatingPr: boolean;
  gitChanges: GitChanges;
  originalGitChanges: {
    [path: string]: GitFileCompare;
  };
  outOfSyncChanges: {
    [path: string]: GitFileCompare;
  };
  sourceModulesByPath: { [path: string]: Module };
};

export const state: State = {
  gitState: SandboxGitState.SYNCING,
  repoTitle: '',
  sourceSandboxId: null,
  error: null,
  isExported: false,
  showExportedModal: false,
  isFetching: false,
  subject: '',
  description: '',
  commit: null,
  pr: null,
  isCommitting: false,
  isCreatingPr: false,
  sourceModulesByPath: {},
  gitChanges: {
    added: [],
    deleted: [],
    modified: [],
    rights: '',
  },
  originalGitChanges: {},
  outOfSyncChanges: {},
};
