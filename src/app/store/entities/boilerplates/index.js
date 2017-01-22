// @flow
import { Schema } from 'normalizr';

import createEntity from '../create-entity';

const schema = new Schema('boilerplates');

export type Boilerplate = {
  id: string;
  code: string;
  condition: string;
  sourceId: string;
};

export default createEntity(schema);
