import { types } from 'mobx-state-tree';

export default {
  deploying: types.boolean,
  url: types.maybe(types.string),
};
