import { GitInfo } from '@codesandbox/common/lib/types';

type State = {
  repoTitle: string;
  error: string;
  isExported: boolean;
  showExportedModal: boolean;
  isFetching: boolean;
  subject: string;
  description: string;
  originalGitChanges: {
    added: string[];
    deleted: string[];
    modified: string[];
    rights: string;
  };
  commit: {
    git: GitInfo;
    merge: boolean;
    newBranch: string;
    sha: string;
    url: string;
  };
  pr: {
    git: GitInfo;
    newBranch: string;
    sha: string;
    url: string;
    prURL: string;
  };
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
