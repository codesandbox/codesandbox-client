// @flow
import { schema } from 'normalizr';
import { getSandboxOptions } from 'common/url';

import { findMainModule } from './modules/selectors';
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
        currentModule = findMainModule(
          sandbox.modules,
          sandbox.directories,
          sandbox.entry
        ),
        initialPath,
        isInProjectView,
        isEditorScreen,
        isPreviewScreen,
      } = getSandboxOptions(document.location.href);

      return {
        ...sandbox,
        isInProjectView,
        showEditor: !isPreviewScreen,
        showPreview: !isEditorScreen,
        currentModule,
        initialPath,
        tabs: [currentModule]
          .filter(x => x)
          .map(m => ({ moduleId: m.id, dirty: true })),
        forcedRenders: 0, // used to force renders
      };
    },
  }
);
