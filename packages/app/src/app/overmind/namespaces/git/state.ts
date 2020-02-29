import { GitChanges, GitCommit, GitPr } from '@codesandbox/common/lib/types';

type State = {
  repoTitle: string;
  error: string | null;
  isExported: boolean;
  showExportedModal: boolean;
  isFetching: boolean;
  subject: string;
  description: string;
  originalGitChanges: GitChanges | null;
  commit: GitCommit | null;
  isCommitting: boolean;
} & (
  | {
      isCreatingPr: true;
      pr: null;
    }
  | {
      isCreatingPr: false;
      pr: GitPr;
    }
);

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
  isCreatingPr: true,
};
