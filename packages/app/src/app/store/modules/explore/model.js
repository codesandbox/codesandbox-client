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

const Sandbox = types.model('Sandbox', {
  viewCount: types.number,
  title: types.maybeNull(types.string),
  template: types.string,
  id: types.string,
  picks: types.optional(types.array(Picks), []),
  description: types.maybeNull(types.string),
  git: types.maybeNull(Git),
  author: types.maybeNull(Author),
});

const PopularSandboxes = types.model('PopularSandboxes', {
  startDate: types.string,
  sandboxes: types.array(Sandbox),
  endDate: types.string,
});

const PickedSandboxes = types.model('PickedSandboxes', {
  sandboxes: types.array(Sandbox),
  page: types.number,
});

export default {
  popularSandboxes: types.maybeNull(PopularSandboxes),
  pickedSandboxesLoading: types.boolean,
  pickedSandboxes: types.maybeNull(PickedSandboxes),
};
