// @flow
import { Schema, arrayOf } from 'normalizr';
import moduleEntity from '../modules/';

import createEntity from '../create-entity';

const schema = new Schema('sandboxes');
schema.define({
  modules: arrayOf(moduleEntity.schema),
});

export type Sandbox = {
  id: number;
  title: string;
  slug: string;
  description: string;
  modules: Array<string>;
};

export default createEntity(schema);
