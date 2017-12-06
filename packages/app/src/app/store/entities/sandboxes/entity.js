// @flow
import { schema } from 'normalizr';
import { getSandboxOptions } from 'common/url';

import { findMainModule, findCurrentModule } from './modules/selectors';
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
        currentModule: hrefCurrentModule,
        initialPath,
        isInProjectView,
        isEditorScreen,
        isPreviewScreen,
      } = getSandboxOptions(document.location.href);

      const currentModule = hrefCurrentModule || sandbox.currentModule;

      const mainModule = findMainModule(
        sandbox.modules,
        sandbox.directories,
        sandbox.entry
      );

      const resolvedCurrentModule = findCurrentModule(
        sandbox.modules,
        sandbox.directories,
        currentModule,
        mainModule
      );

      return {
        ...sandbox,
        isInProjectView,
        showEditor: !isPreviewScreen,
        showPreview: !isEditorScreen,
        currentModule: resolvedCurrentModule,
        initialPath,
        tabs: [resolvedCurrentModule]
          .filter(x => x)
          .map(m => ({ moduleId: m.id, dirty: true })),
        forcedRenders: 0, // used to force renders
      };
    },
  }
);
