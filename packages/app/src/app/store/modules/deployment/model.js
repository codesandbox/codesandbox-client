import { types } from 'mobx-state-tree';

export default {
  deploying: types.boolean,
  url: types.maybeNull(types.string),
};
