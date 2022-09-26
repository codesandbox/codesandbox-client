import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useAppState } from 'app/overmind';
import React from 'react';
import { DashboardBranch } from '../../types';
import { useSelection } from '../Selection';
import { BranchCard } from './BranchCard';
import { BranchListItem } from './BranchListItem';

export const Branch: React.FC<DashboardBranch> = ({ branch }) => {
  const {
    dashboard: { viewMode },
  } = useAppState();
  const { selectedIds, onRightClick, onMenuEvent } = useSelection();
  const { name, project } = branch;

  const branchUrl = v2BranchUrl({ name, project });

  const handleContextMenu = event => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, branch.id);
    else onMenuEvent(event, branch.id);
  };

  const selected = selectedIds.includes(branch.id);

  const props = {
    branch,
    branchUrl,
    onContextMenu: handleContextMenu,
    selected,
    /**
     * If we ever need selection for branch entries, `data-selection-id` must be set
     * 'data-selection-id': branch.id,
     */
  };

  return {
    grid: <BranchCard {...props} />,
    list: <BranchListItem {...props} />,
  }[viewMode];
};
