import React from 'react';
import { useAppState } from 'app/overmind';
import { SyncedSandboxCard } from './SyncedSandboxCard';
import { SyncedSandboxListItem } from './SyncedSandboxListItem';
import { useSelection } from '../Selection';
import { DashboardSyncedRepo } from '../../types';

export const SyncedSandbox = ({
  name = '',
  path = null,
  ...props
}: DashboardSyncedRepo) => {
  const { dashboard } = useAppState();

  const Component =
    dashboard.viewMode === 'list' ? SyncedSandboxListItem : SyncedSandboxCard;

  // interactions
  const { onRightClick, onMenuEvent } = useSelection();

  const url = '/dashboard/synced-sandboxes' + path;

  const onContextMenu = event => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, path);
    else onMenuEvent(event, path);
  };

  const syncedSandboxProps = {
    name,
    path,
    url,
    onContextMenu,
  };

  return <Component {...syncedSandboxProps} {...props} />;
};
