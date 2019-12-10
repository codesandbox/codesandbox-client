import { HIDDEN_DIRECTORIES } from '@codesandbox/common/lib/templates/constants/files';
import { inject, observer } from 'app/componentConnectors';
import { sortBy } from 'lodash-es';
import * as React from 'react';

import DirectoryEntry from '..';

import { ModuleEntry } from './ModuleEntry';

const DirectoryChildren = ({
  depth = 0,
  parentShortid,
  deleteEntry,
  isInProjectView,
  store,
  discardModuleChanges,
  signals,
  renameValidator,
}) => {
  const {
    id: sandboxId,
    modules,
    directories,
    template: sandboxTemplate,
  } = store.editor.currentSandbox;
  const { mainModule, currentModuleShortid } = store.editor;
  const mainModuleId = mainModule.id;

  return (
    <div>
      {sortBy(directories, 'title')
        .filter(x => x.directoryShortid === parentShortid)
        .filter(
          x =>
            !(
              x.directoryShortid == null && HIDDEN_DIRECTORIES.includes(x.title)
            )
        )
        .map(dir => (
          <DirectoryEntry
            key={dir.id}
            siblings={[...directories, ...modules]}
            depth={depth + 1}
            signals={
              signals /* TODO: Just pass what is needed by the DragDrop */
            }
            id={dir.id}
            shortid={dir.shortid}
            title={dir.title}
            sandboxId={sandboxId}
            sandboxTemplate={sandboxTemplate}
            mainModuleId={mainModuleId}
            modules={modules}
            directories={directories}
            currentModuleShortid={currentModuleShortid}
            isInProjectView={isInProjectView}
          />
        ))}
      {sortBy(
        modules.filter(x => x.directoryShortid === parentShortid),
        'title'
      ).map(m => (
        <ModuleEntry
          key={m.id}
          module={m}
          depth={depth}
          deleteEntry={deleteEntry}
          discardModuleChanges={discardModuleChanges}
          renameValidator={renameValidator}
        />
      ))}
    </div>
  );
};

export default inject('store', 'signals')(observer(DirectoryChildren));
