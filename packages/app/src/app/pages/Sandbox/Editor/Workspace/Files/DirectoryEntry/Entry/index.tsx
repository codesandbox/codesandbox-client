import theme from '@codesandbox/common/lib/theme';
import { Directory, Module } from '@codesandbox/common/lib/types';
import { ContextMenu, ContextMenuItemType } from 'app/components/ContextMenu';
import React, { useState } from 'react';
import { DragSource } from 'react-dnd';
import EditIcon from 'react-icons/lib/go/pencil';
import DeleteIcon from 'react-icons/lib/go/trashcan';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';
import UploadFileIcon from 'react-icons/lib/md/file-upload';
import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import UndoIcon from 'react-icons/lib/md/undo';

import { EntryContainer } from '../../../elements';
import { EditIcons } from './EditIcons';
import { NotSyncedIconWithMargin, Right } from './elements';
import { EntryIcons } from './EntryIcons';
import { EntryTitle } from './EntryTitle';
import { EntryTitleInput } from './EntryTitleInput';

interface IEntryProps {
  renameValidator?: (id: string, title: string) => string | false | null;
  shortid?: string;
  id: string;
  title?: string;
  root?: boolean;
  isOpen?: boolean;
  hasChildren?: boolean;
  closeTree?: any;
  rename?: (shortid: string, title: string) => void;
  deleteEntry?: (shortid: string, title: string) => void;
  depth?: number;
  type?: string;
  active?: boolean;
  discardModuleChanges?: (shortid: string, title: string) => void;
  setCurrentModule?: (id: string) => void;
  connectDragSource?: (node: JSX.Element) => JSX.Element;
  onCreateDirectoryClick?: () => boolean | void;
  onCreateModuleClick?: () => boolean | void;
  onUploadFileClick?: () => boolean | void;
  onClick?: () => void;
  markTabsNotDirty?: () => void;
  onRenameCancel?: () => void;
  getModulePath?: (
    modules: Module[],
    directories: Directory[],
    id: string
  ) => string;
  isNotSynced?: boolean;
  isMainModule?: boolean;
  moduleHasError?: boolean;
  rightColors?: string[];
  state?: string;
}

const EntryElement: React.FC<IEntryProps> = ({
  title,
  id,
  depth,
  type,
  active,
  setCurrentModule,
  connectDragSource,
  discardModuleChanges,
  onCreateModuleClick,
  onCreateDirectoryClick,
  onUploadFileClick,
  deleteEntry,
  onClick,
  onRenameCancel,
  markTabsNotDirty,
  rename,
  isNotSynced,
  isMainModule,
  moduleHasError,
  shortid,
  rightColors,
  renameValidator,
  state: incomingState = '',
}) => {
  const [state, setState] = useState(incomingState);
  const [error, setError] = useState<string | false | null>(null);
  const [hovering, setHovering] = useState(false);

  const resetState = () => {
    if (onRenameCancel) {
      onRenameCancel();
    }

    setState('');
    setError(null);
  };

  const handleValidateTitle = (titleToValidate: string) => {
    const isInvalidTitle = renameValidator(id, titleToValidate);
    setError(isInvalidTitle);

    return isInvalidTitle;
  };

  const renameAction = () => {
    setState('editing');
    return true;
  };

  const deleteAction = () =>
    deleteEntry ? deleteEntry(shortid, title) : false;

  const discardModuleChangesAction = () =>
    discardModuleChanges ? discardModuleChanges(shortid, title) : false;

  const handleRename = (newTitle: string, force: boolean = false) => {
    if (newTitle === title) {
      resetState();
      return;
    }

    const canRename = !handleValidateTitle(newTitle);

    if (newTitle !== title && canRename && rename) {
      rename(shortid, newTitle);
      resetState();
    } else if (force) {
      resetState();
    }
  };

  const setCurrentModuleAction = () => setCurrentModule(id);

  const onMouseEnter = () => setHovering(true);
  const onMouseLeave = () => setHovering(false);

  const items = [
    [
      isNotSynced && {
        title: 'Discard Changes',
        action: discardModuleChangesAction,
        icon: UndoIcon,
      },
    ].filter(Boolean),
    [
      onCreateModuleClick && {
        title: 'Create File',
        action: onCreateModuleClick,
        icon: AddFileIcon,
      },
      onCreateDirectoryClick && {
        title: 'Create Directory',
        action: onCreateDirectoryClick,
        icon: AddDirectoryIcon,
      },
      onUploadFileClick && {
        title: 'Upload Files',
        action: onUploadFileClick,
        icon: UploadFileIcon,
      },
      rename && {
        title: 'Rename',
        action: renameAction,
        icon: EditIcon,
      },
      deleteEntry && {
        title: 'Delete',
        action: deleteAction,
        color: theme.red.darken(0.2)(),
        icon: DeleteIcon,
      },
    ].filter(Boolean),
  ].filter(Boolean) as ContextMenuItemType[];

  return connectDragSource(
    <div>
      <ContextMenu items={items}>
        <EntryContainer
          onClick={setCurrentModule ? setCurrentModuleAction : onClick}
          onDoubleClick={markTabsNotDirty}
          //  The elements file is still in js
          //  @ts-ignore
          depth={depth}
          nameValidationError={error}
          active={active}
          editing={state === 'editing'}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          alternative={isMainModule}
          rightColors={rightColors}
          noTransition
        >
          <EntryIcons type={type} error={moduleHasError} />
          {state === 'editing' ? (
            <EntryTitleInput
              id={id}
              title={title}
              onChange={handleValidateTitle}
              onCancel={resetState}
              onCommit={handleRename}
              error={error}
            />
          ) : (
            <EntryTitle title={title} />
          )}
          {isNotSynced && !state && <NotSyncedIconWithMargin />}
          {state === '' && (
            <Right>
              {isMainModule && (
                <span
                  style={{
                    fontSize: '.75rem',
                    fontWeight: 600,
                    opacity: hovering ? 0.6 : 0,
                    marginTop: 3,
                    marginRight: 3,
                  }}
                >
                  entry
                </span>
              )}
              <EditIcons
                hovering={hovering}
                onCreateFile={onCreateModuleClick}
                onCreateDirectory={onCreateDirectoryClick}
                onUploadFile={onUploadFileClick}
                onDiscardChanges={isNotSynced && discardModuleChangesAction}
                onDelete={deleteEntry && deleteAction}
                onEdit={rename && renameAction}
                active={active}
                forceShow={window.__isTouch && type === 'directory-open'}
              />
            </Right>
          )}
        </EntryContainer>
      </ContextMenu>
    </div>
  );
};

const entrySource = {
  canDrag: props => !!props.id,
  beginDrag: props => {
    if (props.closeTree) props.closeTree();

    const directory =
      props.type === 'directory' || props.type === 'directory-open';
    return {
      id: props.id,
      shortid: props.shortid,
      directory,
      path: !directory && props.getModulePath(props.id),
    };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export const Entry = DragSource(
  'ENTRY',
  entrySource,
  collectSource
)(EntryElement);
