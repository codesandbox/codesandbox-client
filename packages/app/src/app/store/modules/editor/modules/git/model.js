import { types } from 'mobx-state-tree';

export default {
  repoTitle: types.string,
  error: types.maybe(types.string),
  isExported: types.boolean,
  showExportedModal: types.boolean,
};
