import { types } from 'mobx-state-tree';

export default {
  selectedSandboxes: types.array(types.string),
  isDragging: types.boolean,
  orderBy: types.model({
    order: types.enumeration('order', ['desc', 'asc']),
    field: types.string,
  }),
  filters: types.model({
    blacklistedTemplates: types.array(types.string),
    search: types.string,
  }),
};
