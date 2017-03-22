// @flow
import { schema } from 'normalizr';

export type Directory = {
  id: string,
  title: string,
  directoryShortid: ?string,
  shortid: string,
};

export default new schema.Entity('directories');
