import { types } from 'mobx-state-tree';

const Git = types.model({
  branch: types.string,
  commitSha: types.string,
  path: types.maybeNull(types.string),
  repo: types.string,
  username: types.string,
});

export default {
  repoTitle: types.string,
  error: types.maybeNull(types.string),
  isExported: types.boolean,
  showExportedModal: types.boolean,
  isFetching: types.boolean,
  subject: types.string,
  description: types.string,
  originalGitChanges: types.maybeNull(
    types.model({
      added: types.array(types.string),
      deleted: types.array(types.string),
      modified: types.array(types.string),
      rights: types.string,
    })
  ),
  commit: types.maybeNull(
    types.model({
      git: Git,
      merge: types.maybeNull(types.boolean),
      newBranch: types.maybeNull(types.string),
      sha: types.string,
      url: types.maybeNull(types.string),
    })
  ),
  pr: types.maybeNull(
    types.model({
      git: Git,
      newBranch: types.string,
      sha: types.string,
      url: types.string,
      prURL: types.maybeNull(types.string),
    })
  ),
  isCommitting: types.boolean,
  isCreatingPr: types.boolean,
};
