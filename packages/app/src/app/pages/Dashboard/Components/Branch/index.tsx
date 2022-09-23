import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useAppState } from 'app/overmind';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DashboardBranch } from '../../types';
import { useSelection } from '../Selection';
import { BranchCard } from './BranchCard';
import { BranchListItem } from './BranchListItem';

export const Branch: React.FC<DashboardBranch> = ({ branch }) => {
  const {
    dashboard: { viewMode },
  } = useAppState();
  const history = useHistory();
  const { selectedIds, onRightClick, onMenuEvent } = useSelection();
  const { name, project } = branch;

  const url = v2BranchUrl({ name, project });

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // TODO: add analytics
    if (e.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  const handleContextMenu = event => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, branch.id);
    else onMenuEvent(event, branch.id);
  };

  const selected = selectedIds.includes(branch.id);

  const props = {
    branch,
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    'data-selection-id': branch.id,
    selected,
  };

  return {
    grid: <BranchCard {...props} />,
    list: <BranchListItem {...props} />,
  }[viewMode];
};
