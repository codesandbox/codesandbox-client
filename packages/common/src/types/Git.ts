export type GitChanges = {
  added: string[];
  deleted: string[];
  modified: string[];
  rights: string;
};

export type GitCommit = {
  git: GitInfo;
  merge: boolean;
  newBranch: string;
  sha: string;
  url: string;
};

export type GitInfo = {
  repo: string;
  username: string;
  path: string;
  branch: string;
  commitSha: string;
};

export type GitPr = {
  git: GitInfo;
  newBranch: string;
  sha: string;
  url: string;
  prURL: string;
};
