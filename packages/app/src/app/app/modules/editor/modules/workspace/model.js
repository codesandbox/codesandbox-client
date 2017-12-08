import { types } from 'mobx-state-tree';

export default {
  project: types.model({
    title: types.string,
    description: types.string,
  }),
  isWorkspaceHidden: types.boolean,
  isProcessingNpmDependencies: types.boolean,
};
