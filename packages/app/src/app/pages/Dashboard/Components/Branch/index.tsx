import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { trackImprovedDashboardEvent } from '@codesandbox/common/lib/utils/analytics';
import { useAppState } from 'app/overmind';
import { PageTypes } from 'app/overmind/namespaces/dashboard/types';
import React from 'react';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { DashboardBranch } from '../../types';
import { useSelection } from '../Selection';
import { BranchCard } from './BranchCard';
import { BranchListItem } from './BranchListItem';

const MAP_BRANCH_EVENT_TO_PAGE_TYPE: Partial<Record<PageTypes, string>> = {
  'my-contributions':
    'Dashboard - Open Contribution Branch from My Contributions',
  repositories: 'Dashboard - Open Branch from Repository',
  recent: 'Dashboard - Open Branch from Recent',
};

type BranchProps = DashboardBranch & {
  page: PageTypes;
};
export const Branch: React.FC<BranchProps> = ({ branch, page }) => {
  const {
    dashboard: { removingBranch, removingRepository, viewMode },
  } = useAppState();
  const { selectedIds, onRightClick, onMenuEvent } = useSelection();
  const { name, project } = branch;

  const branchUrl = v2BranchUrl({
    owner: project.repository.owner,
    repoName: project.repository.name,
    branchName: name,
    workspaceId: project.team?.id || null,
  });

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, branch.id);
    else onMenuEvent(event, branch.id);
  };

  const handleClick = () => {
    trackImprovedDashboardEvent(MAP_BRANCH_EVENT_TO_PAGE_TYPE[page]);
  };

  const isParentRepositoryBeingRemoved =
    removingRepository?.owner === project.repository.owner &&
    removingRepository?.name === project.repository.name;

  const { isFree } = useWorkspaceSubscription();

  const isPrivate = branch?.project?.repository?.private;
  const restricted = isFree && isPrivate && page === 'recent';

  const props = {
    branch,
    branchUrl,
    selected: selectedIds.includes(branch.id),
    isBeingRemoved:
      removingBranch?.id === branch.id || isParentRepositoryBeingRemoved,
    onContextMenu: handleContextMenu,
    onClick: handleClick,
    restricted,
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
