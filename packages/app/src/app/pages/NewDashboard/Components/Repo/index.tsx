import React from 'react';
import { join, dirname } from 'path';
import { useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useLocation, useHistory } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { RepoCard } from './RepoCard';
import { RepoListItem } from './RepoListItem';
import { useSelection } from '../Selection';
import { DashboardRepo } from '../../types';

export const Repo = ({
  name = '',
  path = null,
  sandboxes = 0,
  ...props
}: DashboardRepo) => {
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
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? RepoListItem : RepoCard;

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
  } = useSelection();

  const selected = selectedIds.includes(path) || isNewFolder;
  const isDragging = isAnythingDragging && selected;

  const onClick = event => {
    onSelectionClick(event, path);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    const url = '/new-dashboard/repositories' + path;
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

  const folderProps = {
    name,
    path,
    onClick,
    onDoubleClick,
    // edit mode
    isNewFolder,
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
