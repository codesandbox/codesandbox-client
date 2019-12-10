import { useOvermind } from 'app/overmind';
import React from 'react';

import EditIcons from './DirectoryEntry/Entry/EditIcons';
import DirectoryEntry from './DirectoryEntry/index';

interface IFilesProps {
  setEditActions: React.Dispatch<any>;
}

export const Files: React.FC<IFilesProps> = ({ setEditActions }) => {
  const {
    state: {
      editor: { currentSandbox: sandbox },
      isLoggedIn,
    },
    actions: {
      editor: { createZipClicked },
    },
  } = useOvermind();

  return (
    <DirectoryEntry
      root
      title={sandbox.title || 'Project'}
      initializeProperties={({
        onCreateModuleClick,
        onCreateDirectoryClick,
        onUploadFileClick,
      }) => {
        if (setEditActions) {
          setEditActions(
            // @ts-ignore
            <EditIcons
              hovering
              forceShow={window.__isTouch}
              onCreateFile={onCreateModuleClick}
              onCreateDirectory={onCreateDirectoryClick}
              onDownload={createZipClicked}
              onUploadFile={
                isLoggedIn && sandbox.privacy === 0
                  ? onUploadFileClick
                  : undefined
              }
            />
          );
        }
      }}
      depth={-1}
      id={null}
      shortid={null}
    />
  );
};
