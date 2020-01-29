import React from 'react';
import { useOvermind } from 'app/overmind';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { Collapsible } from '@codesandbox/components';

import DirectoryEntry from './DirectoryEntry/index';
import EditIcons from './DirectoryEntry/Entry/EditIcons';

interface IFilesProps {
  setEditActions: React.Dispatch<any>;
}

export const Files: React.FC<IFilesProps> = ({ setEditActions }) => {
  const {
    state: { editor: editorState, isLoggedIn },
    actions: { editor, files },
  } = useOvermind();

  const { currentSandbox: sandbox } = editorState;

  const _getModulePath = moduleId => {
    try {
      return getModulePath(sandbox.modules, sandbox.directories, moduleId);
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      <Collapsible title="Files" defaultOpen>
        <DirectoryEntry
          root
          getModulePath={_getModulePath}
          title={sandbox.title || 'Project'}
          signals={{ files, editor }}
          store={{ editor: editorState, isLoggedIn }}
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
                  onDownload={editor.createZipClicked}
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
      </Collapsible>
    </>
  );
};
