import { GitCommit, GitPr, GitChanges } from '@codesandbox/common/lib/types';

type State = {
  repoTitle: string;
  error: string;
  isExported: boolean;
  showExportedModal: boolean;
  isFetching: boolean;
  subject: string;
  description: string;
  originalGitChanges: GitChanges;
  commit: GitCommit;
  pr: GitPr;
  isCommitting: boolean;
  isCreatingPr: boolean;
};

export const state: State = {
  repoTitle: '',
  error: null,
  isExported: false,
  showExportedModal: false,
  isFetching: false,
  subject: '',
  description: '',
  originalGitChanges: null,
  commit: null,
  pr: null,
  isCommitting: false,
  isCreatingPr: false,
};
