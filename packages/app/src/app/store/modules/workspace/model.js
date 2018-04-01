import { types } from 'mobx-state-tree';

export default {
  project: types.model({
    title: types.string,
    description: types.string,
  }),
  tags: types.model({
    tagName: types.string,
  }),

  openedWorkspaceItem: types.maybe(types.string),
};
