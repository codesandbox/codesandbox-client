import React from 'react';
import { join, dirname } from 'path';
import { useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useLocation, useHistory } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { FolderCard } from './FolderCard';
import { FolderListItem } from './FolderListItem';
import { useSelection } from '../Selection';

export const Folder = ({
  name = '',
  path = null,
  sandboxes = 0,
  setCreating,
  ...props
}) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  const isNewFolder = !path;
  const isDrafts = path === '/drafts';

  const location = useLocation();

  /* View logic */

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? FolderListItem : FolderCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onMouseDown,
    onRightClick,
    onMenuEvent,
    onBlur,
    onKeyDown,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging: isAnythingDragging,
    isRenaming,
    setRenaming,
  } = useSelection();

  const selected = selectedIds.includes(path) || isNewFolder;
  const isDragging = isAnythingDragging && selected;

  const onClick = event => {
    onSelectionClick(event, path);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    const url = '/new-dashboard/all' + path;
    if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  const onContextMenu = event => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, path);
    else onMenuEvent(event, path);
  };

  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: { outline: 'none' }, // we handle outline with border
    selected,
    onClick,
    onMouseDown,
    onDoubleClick,
    onContextMenu,
    onBlur,
    onKeyDown,
    'data-selection-id': path,
  };

  /* Drop target logic */

  const accepts = ['sandbox'];
  if (!isDrafts) accepts.push('folder');

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: accepts,
    drop: () => ({ path }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !isSamePath(monitor.getItem(), path),
    }),
  });

  const dropProps = {
    ref: dropRef,
  };

  /* Drag logic */

  const parent =
    !isNewFolder &&
    path
      .split('/')
      .slice(0, -1)
      .join('/');

  const [, dragRef, preview] = useDrag({
    item: { type: 'folder', path, parent, name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!dropResult || !dropResult.path) return;
      if (isSamePath(dropResult, path)) return;

      onDrop(dropResult);
    },
  });

  const dragProps = isDrafts
    ? {}
    : {
        ref: dragRef,
        onDragStart: event => onDragStart(event, path),
      };

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  /* Edit logic */
  const [newName, setNewName] = React.useState(name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setRenaming(false);
      if (setCreating) setCreating(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // nothing to do here
    } else if (isNewFolder) {
      if (newName) {
        const folderLocation = location.pathname.split(
          '/new-dashboard/all/'
        )[1];

        let folderPath = '';
        if (folderLocation) folderPath += '/' + folderLocation;
        folderPath += '/' + newName;

        await actions.dashboard.createFolder(folderPath);
        track('Dashboard2 - Create Folder', { source: 'Grid' });
      }
    } else {
      await actions.dashboard.renameFolder({
        path,
        newPath: join(dirname(path), newName),
      });
      track('Dashboard2 - Rename Folder', { source: 'Grid' });
    }

    if (setCreating) setCreating(false);
    return setRenaming(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    setRenaming(false);
    onSubmit();
  };

  // If it's a new folder, enter editing and focus on render
  React.useEffect(() => {
    if (isNewFolder) setRenaming(true);
  }, [isNewFolder, setRenaming]);

  const folderProps = {
    name,
    path,
    isDrafts,
    numberOfSandboxes: sandboxes,
    onClick,
    onDoubleClick,
    // edit mode
    editing: isRenaming && selected,
    isNewFolder,
    newName,
    onChange,
    onInputKeyDown,
    onSubmit,
    onInputBlur,
    // drag preview
    thumbnailRef,
    opacity: isDragging ? 0.25 : 1,
  };

  return (
    <>
      <div {...dragProps}>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isOver && canDrop ? 1.02 : 1 }}
          {...dropProps}
        >
          <Component
            {...folderProps}
            {...interactionProps}
            showDropStyles={isOver && canDrop}
            {...props}
          />
        </motion.div>
      </div>
    </>
  );
};

const isSamePath = (draggedItem, selfPath) => {
  if (draggedItem && draggedItem.path === selfPath) return true;
  return false;
};
