import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { Collapsible, SidebarRow } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import EditIcons from './DirectoryEntry/Entry/EditIcons';
import DirectoryEntry from './DirectoryEntry/index';

export const Files: React.FC<{ readonly?: boolean }> = ({ readonly }) => {
  const {
    state: { editor: editorState, isLoggedIn },
    actions: { editor, files },
  } = useOvermind();

  const [editActions, setEditActions] = React.useState(null);

  const { currentSandbox: sandbox } = editorState;

  const _getModulePath = React.useCallback(
    moduleId => {
      try {
        return getModulePath(sandbox.modules, sandbox.directories, moduleId);
      } catch (e) {
        return '';
      }
    },
    [sandbox.directories, sandbox.modules]
  );

  return (
    <>
      <Collapsible title="Files" defaultOpen css={{ position: 'relative' }}>
        <SidebarRow
          justify="flex-end"
          css={css({
            // these could have been inside the collapsible as "actions"
            // but this is the only exception where we have actions in the
            // collapsible header. Keeping them in the body, also lets us
            // get the animation effect of open/close state on it's own
            // If this UI pattern catches on, it would be a good refactor
            // to add actions API to collapsible
            position: 'absolute',
            top: 0,
            right: 2,
          })}
        >
          {editActions}
        </SidebarRow>
        <DirectoryEntry
          root
          readonly={readonly}
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
