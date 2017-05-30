// @flow
import { schema } from 'normalizr';
import { getSandboxOptions } from 'common/url';
import moduleEntity from './modules/entity';
import directoryEntity from './directories/entity';
import userEntity from '../users/entity';

export default new schema.Entity(
  'sandboxes',
  {
    modules: [moduleEntity],
    directories: [directoryEntity],
    currentModule: moduleEntity,
    author: userEntity,
  },
  {
    processStrategy: sandbox => {
      const {
        currentModule,
        isEditorScreen,
        isPreviewScreen,
      } = getSandboxOptions(document.location.href);
      return {
        ...sandbox,
        isInProjectView: currentModule == null,
        showEditor: !isPreviewScreen,
        showPreview: !isEditorScreen,
        currentModule,
        errors: [],
      };
    },
  },
);
