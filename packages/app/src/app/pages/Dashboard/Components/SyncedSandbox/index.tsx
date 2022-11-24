import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { SyncedSandboxCard } from './SyncedSandboxCard';
import { SyncedSandboxListItem } from './SyncedSandboxListItem';
import { useSelection } from '../Selection';
import { DashboardRepo } from '../../types';

export const SyncedSandbox = ({
  name = '',
  path = null,
  ...props
}: DashboardRepo) => {
  const { dashboard } = useAppState();

  const Component =
    dashboard.viewMode === 'list' ? SyncedSandboxListItem : SyncedSandboxCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onMouseDown,
    onRightClick,
    onMenuEvent,
    onBlur,
  } = useSelection();

  const selected = selectedIds.includes(path);

  const onClick = event => {
    onSelectionClick(event, path);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    // TODO: map repo type to url
    const url = '/dashboard/synced-sandboxes' + path;
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
    isViewOnly: false,
    isScrolling: props.isScrolling,
    'data-selection-id': path,
  };

  const folderProps = {
    name,
    path,
    onClick,
    onDoubleClick,
  };

  return <Component {...folderProps} {...interactionProps} {...props} />;
};
