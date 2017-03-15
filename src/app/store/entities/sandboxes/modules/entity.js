// @flow
import { schema } from 'normalizr';

export type Module = {
  id: string,
  title: string,
  code: ?string,
  directoryId: ?string,
  isNotSynced: boolean,
};

export default new schema.Entity('modules');
