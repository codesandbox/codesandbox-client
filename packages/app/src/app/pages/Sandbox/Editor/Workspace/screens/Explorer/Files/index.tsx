import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { Collapsible, SidebarRow } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent, useCallback, useState } from 'react';

import { useAppState, useActions } from 'app/overmind';

import EditIcons from './DirectoryEntry/Entry/EditIcons';
import { DirectoryEntry } from './DirectoryEntry/index';

const noop = () => undefined;

type Props = {
  readonly: boolean;
};
export const Files: FunctionComponent<Props> = ({ readonly }) => {
  const { editor, files } = useActions();
  const {
    editor: editorState,
    editor: {
      currentSandbox: { directories, modules, privacy, title },
    },
    isLoggedIn,
  } = useAppState();
  const [editActions, setEditActions] = useState(null);

  const _getModulePath = useCallback(
    moduleId => {
      try {
        return getModulePath(modules, directories, moduleId);
      } catch {
        return '';
      }
    },
    [directories, modules]
  );

  return (
    <Collapsible css={{ position: 'relative' }} defaultOpen title="Files">
      <SidebarRow
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
        justify="flex-end"
      >
        {editActions}
      </SidebarRow>

      <DirectoryEntry
        depth={-1}
        getModulePath={_getModulePath}
        id={null}
        initializeProperties={({
          onCreateDirectoryClick,
          onUploadFileClick,
          onCreateModuleClick,
        }) => {
          setEditActions(
            // @ts-ignore
            <EditIcons
              forceShow={window.__isTouch}
              hovering
              onCreateDirectory={onCreateDirectoryClick}
              onCreateFile={onCreateModuleClick}
              onDownload={editor.createZipClicked}
              onUploadFile={
                isLoggedIn && privacy === 0 ? onUploadFileClick : noop
              }
            />
          );
        }}
        readonly={readonly}
        root
        shortid={null}
        signals={{ files, editor }}
        store={{ editor: editorState, isLoggedIn }}
        title={title || 'Project'}
      />
    </Collapsible>
  );
};
