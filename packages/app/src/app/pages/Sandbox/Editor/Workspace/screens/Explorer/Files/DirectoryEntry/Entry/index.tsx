import theme from '@codesandbox/common/lib/theme';
import { Directory, Module } from '@codesandbox/common/lib/types';
import { ListAction, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { ContextMenu, ContextMenuItemType } from 'app/components/ContextMenu';
import React, { useState } from 'react';
import { DragSource } from 'react-dnd';

import {
  AddDirectoryIcon,
  AddFileIcon,
  DeleteIcon,
  EditIcon,
  NotSyncedIcon,
  UndoIcon,
  UploadFileIcon,
} from '../../icons';
import EditIcons from './EditIcons';
import { EntryIcons } from './EntryIcons';
import { FileInput } from './FileInput';

interface IEntryProps {
  renameValidator?: (id: string, title: string) => string | false | null;
  shortid?: string;
  readonly?: boolean;
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
  copyESModuleURL?: () => void;
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

const EntryComponent: React.FC<IEntryProps> = ({
  title,
  id,
  readonly,
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
  copyESModuleURL,
  markTabsNotDirty,
  rename,
  isNotSynced,
  isMainModule,
  moduleHasError,
  shortid,
  rightColors = [],
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

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      if (setCurrentModule) {
        setCurrentModuleAction();
      } else if (typeof onClick === 'function') {
        onClick();
      }
    }
  };

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
      !!copyESModuleURL && {
        title: 'Copy as ESModule URL',
        action: copyESModuleURL,
        icon: AddFileIcon, // TODO: Figure out what the actual icon is
        isNewFeature: true,
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
      <ContextMenu items={readonly ? [] : items}>
        <ListAction
          justify="space-between"
          onClick={setCurrentModule ? setCurrentModuleAction : onClick}
          onKeyPress={onKeyPress}
          // @ts-ignore
          tabIndex="0"
          onDoubleClick={markTabsNotDirty}
          aria-selected={active}
          aria-expanded={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          css={{
            paddingLeft: depth
              ? `calc(${depth + 1}rem - 2px)`
              : 'calc(1rem - 2px)',
            // live user
            borderRight: '2px solid',
            minHeight: 28,
            borderColor: rightColors[0] || 'transparent',
            ':hover:not([aria-selected="true"])': {
              // override ListAction to keep background same as before
              // we do this to diffrentiate between hover and selected
              backgroundColor: 'inherit',
            },
          }}
        >
          <Stack gap={2} align="center" css={{ width: '100%' }}>
            <EntryIcons type={type} error={moduleHasError} />
            {state === 'editing' ? (
              <FileInput
                id={id}
                title={title}
                onChange={handleValidateTitle}
                onCancel={resetState}
                onCommit={handleRename}
                error={error}
                css={css({
                  // i know how this looks, but to make the input feel like
                  // it's editing in place, we move it back half the space
                  // 0.5 * gap of 2 = 1 and then another 1px for the border
                  // :upside-down:smile:
                  marginLeft: '-5px',
                  paddingLeft: 1,
                })}
              />
            ) : (
              <Text maxWidth="100%">{title}</Text>
            )}
            {isNotSynced && !state && (
              <NotSyncedIcon css={css({ color: 'blues.300' })} />
            )}
          </Stack>
          {state === '' && (
            <Stack align="top">
              {isMainModule && hovering && (
                <Text variant="muted" size={2}>
                  entry
                </Text>
              )}
              {!readonly && (
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
              )}
            </Stack>
          )}
        </ListAction>
        {error && typeof error === 'string' && (
          <Text
            size={3}
            variant="danger"
            block
            role="alert"
            id={`error-${id}`}
            css={{
              // align with file name
              marginLeft: depth
                ? `calc(${depth + 1}rem + 24px)`
                : 'calc(1rem + 24px)',
            }}
          >
            {error}
          </Text>
        )}
      </ContextMenu>
    </div>
  );
};

const entrySource = {
  canDrag: props => !props.readonly && !!props.id,
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
)(EntryComponent);
