import { types } from 'mobx-state-tree';

const Git = types.model({
  branch: types.string,
  commitSha: types.string,
  path: types.maybe(types.string),
  repo: types.string,
  username: types.string,
});

export default {
  repoTitle: types.string,
  error: types.maybe(types.string),
  isExported: types.boolean,
  showExportedModal: types.boolean,
  isFetching: types.boolean,
  subject: types.string,
  description: types.string,
  originalGitChanges: types.maybe(
    types.model({
      added: types.array(types.string),
      deleted: types.array(types.string),
      modified: types.array(types.string),
      rights: types.string,
    })
  ),
  commit: types.maybe(
    types.model({
      git: Git,
      merge: types.maybe(types.boolean),
      newBranch: types.maybe(types.string),
      sha: types.string,
      url: types.maybe(types.string),
    })
  ),
  pr: types.maybe(
    types.model({
      git: Git,
      newBranch: types.string,
      sha: types.string,
      url: types.string,
      prURL: types.maybe(types.string),
    })
  ),
  isCommiting: types.boolean,
  isCreatingPr: types.boolean,
};
