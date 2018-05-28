import { types } from 'mobx-state-tree';

export default {
  sandboxes: types.array(
    types.model({
      id: types.string,
      title: types.maybe(types.string),
      insertedAt: types.string,
      updatedAt: types.string,
      template: types.string,
    })
  ),
  selectedSandboxes: types.array(types.string),
};
