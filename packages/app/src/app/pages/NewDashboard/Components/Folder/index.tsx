import React from 'react';
import { join, dirname } from 'path';
import { useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useLocation, useHistory } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { FolderCard } from './FolderCard';
import { FolderListItem } from './FolderListItem';
import { useSelection } from '../Selection';
import { DashboardFolder } from '../../types';

export const Folder = ({
  name = '',
  path = null,
  sandboxCount = 0,
  type,
  ...props
}: DashboardFolder) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  const location = useLocation();

  /* View logic */

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
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
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging: isAnythingDragging,
    isRenaming,
    setRenaming,
    activeTeamId,
  } = useSelection();

  const selected = selectedIds.includes(path);
  const isDragging = isAnythingDragging && selected;

  const onClick = event => {
    onSelectionClick(event, path);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    const url = dashboardUrls.allSandboxes(path, activeTeamId);

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
    'data-selection-id': path,
  };

  /* Drop target logic */

  const accepts = ['sandbox'];

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

  const parent = path
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

  const dragProps = {
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
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (name === newName) {
      // nothing to do here
    } else {
      await actions.dashboard.renameFolder({
        path,
        newPath: join(dirname(path), newName),
        teamId: activeTeamId,
        newTeamId: activeTeamId,
      });
      track('Dashboard - Rename Folder', {
        source: 'Grid',
        dashboardVersion: 2,
      });
    }

    return setRenaming(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    setRenaming(false);
    onSubmit();
  };

  const folderProps = {
    name,
    path,
    numberOfSandboxes: sandboxCount,
    onClick,
    onDoubleClick,
    // edit mode
    editing: isRenaming && selected,
    isNewFolder: false,
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
