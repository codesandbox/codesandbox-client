// @flow
import { schema } from 'normalizr';
import moduleEntity from './modules/entity';
import directoryEntity from './directories/entity';
import userEntity from './users/entity';

export default new schema.Entity(
  'sandboxes',
  {
    modules: [moduleEntity],
    directories: [directoryEntity],
    currentModule: moduleEntity,
    author: userEntity,
  },
  {
    processStrategy: value => ({
      ...value,
      isInProjectView: true,
      showEditor: true,
      showPreview: true,
    }),
  }
);
