import { types } from 'mobx-state-tree';

export default {
  selectedSandboxes: types.array(types.string),
};
