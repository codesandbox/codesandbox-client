// @flow
import { schema } from 'normalizr';

import sourceEntity from '../sources/';
import versionEntity from '../versions/';

export default new schema.Entity('sandboxes', {
  source: sourceEntity,
  versions: [versionEntity],
});

export type Sandbox = {
  id: string;
  title: string;
  description: string;
  shortid: string;
  source: string;
};

