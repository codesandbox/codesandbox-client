import React from 'react';
import { join, dirname } from 'path';
import { useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useLocation, useHistory } from 'react-router-dom';
import { isMenuClicked } from '@codesandbox/components';
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

  const location = useLocation();

  /* Edit logic */
  const [editing, setEditing] = React.useState(isNewFolder || false);
  const [newName, setNewName] = React.useState(name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setEditing(false);
      setCreating(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // do nothing
    } else if (isNewFolder) {
      if (newName) {
        const folderLocation = location.pathname.split(
          '/new-dashboard/all/'
        )[1];

        const folderPath =
          '' + (folderLocation && '/' + folderLocation) + '/' + newName;

        await actions.dashboard.createFolder(folderPath);
      }
    } else {
      await actions.dashboard.renameFolder({
        path,
        newPath: join(dirname(path), newName),
      });
    }

    setCreating(false);
    return setEditing(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const inputRef = React.useRef(null);
  const enterEditing = () => {
    setEditing(true);
    // Menu defaults to sending focus back to Menu Button
    // Send focus to input in the next tick
    // after menu is done closing.
    setTimeout(() => inputRef.current.focus());
  };
  // If it's a new folder, enter editing and focus on render
  React.useEffect(() => {
    if (isNewFolder) enterEditing();
  }, [isNewFolder]);

  /* View logic */

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? FolderListItem : FolderCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onRightClick,
    onBlur,
    onKeyDown,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging: isAnythingDragging,
  } = useSelection();

  const selected = selectedIds.includes(path);
  const isDragging = isAnythingDragging && selected;

  /* Prevent opening sandbox while interacting */
  const onClick = event => {
    if (editing || isMenuClicked(event)) event.preventDefault();
    onSelectionClick(event, path);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    if (editing || isDragging || isMenuClicked(event)) return;

    const url = '/new-dashboard/all' + path;
    if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  const onContextMenu = event => {
    event.preventDefault();
    onRightClick(event, path);
  };

  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: { outline: 'none' }, // we handle outline with border
    selected,
    onClick,
    onDoubleClick,
    onContextMenu,
    onBlur,
    onKeyDown,
    'data-selection-id': path,
  };

  /* Drop target logic */

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ['sandbox', 'folder'],
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

      onDrop(dropResult);
    },
  });

  const dragProps = {
    ref: dragRef,
  };

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const folderProps = {
    name,
    path,
    numberOfSandboxes: sandboxes,
    onClick,
    onDoubleClick,
    // edit mode
    editing,
    enterEditing,
    isNewFolder,
    newName,
    inputRef,
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
      <div {...dragProps} onDragStart={event => onDragStart(event, path)}>
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
