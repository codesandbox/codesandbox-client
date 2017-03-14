// @flow
import { schema } from 'normalizr';

import module from './modules/entity';
import directory from './directories/entity';

export type Source = {
  id: string,
  modules: Array<string>,
  directories: Array<string>,
};

export default new schema.Entity('sources', {
  modules: [module],
  directory: [directory],
});
