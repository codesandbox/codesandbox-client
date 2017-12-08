import { types } from 'mobx-state-tree';

export default {
  settings: types.model({
    prettifyOnSaveEnabled: types.boolean,
  }),
  showEditor: types.boolean,
  showPreview: types.boolean,
};
