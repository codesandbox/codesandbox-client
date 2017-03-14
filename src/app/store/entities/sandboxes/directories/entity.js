// @flow
import { schema } from 'normalizr';

export type Directory = {
  id: string,
  title: string,
  directoryId: ?string,
};

export default new schema.Entity('directories');
