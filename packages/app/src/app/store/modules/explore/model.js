import { types } from 'mobx-state-tree';

const Git = types.model('Git', {
  username: types.string,
  repo: types.string,
  path: types.string,
  commitSha: types.maybeNull(types.string),
  branch: types.string,
});

const Author = types.model('Author', {
  username: types.string,
  name: types.maybeNull(types.string),
  id: types.string,
  avatarUrl: types.maybeNull(types.string),
});

const Picks = types.model('Picks', {
  description: types.maybeNull(types.string),
  id: types.string,
  insertedAt: types.string,
});

const PopularSandboxes = types.model('PopularSandboxes', {
  startDate: types.string,
  sandboxes: types.array(
    types.model({
      viewCount: types.number,
      title: types.maybeNull(types.string),
      template: types.string,
      id: types.string,
      picks: types.optional(types.array(Picks), []),
      description: types.maybeNull(types.string),
      git: types.maybeNull(Git),
      author: types.maybeNull(Author),
    })
  ),
  endDate: types.string,
});

export default {
  popularSandboxes: types.maybeNull(PopularSandboxes),
};
