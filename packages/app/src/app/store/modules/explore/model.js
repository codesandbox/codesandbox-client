import { types } from 'mobx-state-tree';
import { Sandbox } from '../editor/model';

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
  title: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  id: types.string,
  insertedAt: types.string,
});

const MiniSandbox = types.model('Sandbox', {
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
  sandboxes: types.array(MiniSandbox),
  endDate: types.string,
});

const PickedSandboxes = types.model('PickedSandboxes', {
  sandboxes: types.array(MiniSandbox),
  page: types.number,
});

const PickedSandboxDetails = types.model('PickedSandboxDetails', {
  title: types.maybeNull(types.string),
  id: types.string,
  description: types.maybeNull(types.string),
});

export default {
  pickedSandboxesIndexes: types.maybeNull(types.array(types.string)),
  popularSandboxes: types.maybeNull(PopularSandboxes),
  pickedSandboxesLoading: types.boolean,
  pickedSandboxes: types.maybeNull(PickedSandboxes),
  selectedSandbox: types.maybeNull(Sandbox),
  pickedSandboxDetails: types.maybeNull(PickedSandboxDetails),
};
