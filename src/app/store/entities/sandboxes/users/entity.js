// @flow
import { schema } from 'normalizr';

export type User = {
  id: string,
  username: string,
  avatarUrl: ?string,
};

export default new schema.Entity('users');
