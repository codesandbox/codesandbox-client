import React from 'react';
import { join, dirname } from 'path';
import { useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { isMenuClicked } from '@codesandbox/components';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { FolderCard } from './FolderCard';
import { FolderListItem } from './FolderListItem';
import { DragPreview } from './DragPreview';

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
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const onBlur = () => {
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

  /* Prevent opening sandbox while interacting */
  const onClick = event => {
    if (editing || isMenuClicked(event)) event.preventDefault();
  };

  /* Drop target logic */

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ['sandbox', 'folder'],
    drop: () => ({ path: path.replace('all', '') }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !isSamePath(monitor.getItem(), path),
    }),
  });

  const dropProps = {
    ref: dropRef,
  };

  /* Drag logic */
  type ItemTypes = { id: string; type: string };

  const [{ isDragging }, dragRef, preview] = useDrag({
    item: { path, type: 'folder' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult || !dropResult.path) return;
      if (isSamePath(dropResult, path)) return;

      if (dropResult.path === 'deleted') {
        actions.dashboard.deleteFolder({ path });
      } else {
        // moving folders into another folder
        // is the same as changing it's path
        actions.dashboard.renameFolder({
          path,
          newPath: dropResult.path + '/' + name,
        });
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragProps = {
    ref: dragRef,
  };

  const thumbnailRef = React.useRef();

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  /* View logic */

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? FolderListItem : FolderCard;

  const folderProps = {
    name,
    path,
    numberOfSandboxes: sandboxes,
    onClick,
    // edit mode
    editing,
    enterEditing,
    isNewFolder,
    newName,
    inputRef,
    onChange,
    onKeyDown,
    onSubmit,
    onBlur,
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
            showDropStyles={isOver && canDrop}
            {...props}
          />
        </motion.div>
      </div>
      {isDragging ? <DragPreview viewMode={viewMode} {...folderProps} /> : null}
    </>
  );
};

const isSamePath = (draggedItem, selfPath) => {
  if (draggedItem && draggedItem.path === selfPath) return true;
  return false;
};
