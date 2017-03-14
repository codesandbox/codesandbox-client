// @flow
import { schema } from 'normalizr';

import source from '../sources/entity';

export type Sandbox = {
  id: string,
  title: ?string,
  description: string,
  source: string,
};

export default new schema.Entity('sandboxes', {
  source,
});
