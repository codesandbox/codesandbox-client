// @flow
import { schema } from 'normalizr';
import { getSandboxOptions } from 'common/url';
import moduleEntity from './modules/entity';
import directoryEntity from './directories/entity';

export default new schema.Entity(
  'sandboxes',
  {
    modules: [moduleEntity],
    directories: [directoryEntity],
    currentModule: moduleEntity,
  },
  {
    processStrategy: sandbox => {
      const {
        currentModule,
        isEditorScreen,
        isPreviewScreen,
      } = getSandboxOptions();
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
