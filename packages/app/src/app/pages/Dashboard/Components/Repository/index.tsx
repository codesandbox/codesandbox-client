import React from 'react';
import { useAppState } from 'app/overmind';
import { trackImprovedDashboardEvent } from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { DashboardRepository } from '../../types';
import { RepositoryCard } from './RepositoryCard';
import { RepositoryListItem } from './RepositoryListItem';
import { RepositoryProps } from './types';
import { useSelection } from '../Selection';

export const Repository: React.FC<DashboardRepository> = ({ repository }) => {
  const { branchCount, repository: providerRepository } = repository;
  const {
    activeTeam,
    dashboard: { viewMode, removingRepository },
  } = useAppState();
  const { selectedIds, onRightClick, onMenuEvent } = useSelection();
  const repositoryId = `${providerRepository.owner}-${providerRepository.name}`;
  const repositoryUrl = dashboard.repository({
    owner: providerRepository.owner,
    name: providerRepository.name,
    teamId: activeTeam,
  });

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.type === 'contextmenu') onRightClick(event, repositoryId);
    else onMenuEvent(event, repositoryId);
  };

  const { isFree, isInactiveTeam } = useWorkspaceSubscription();

  const isPrivate = providerRepository?.private;
  const restricted = (isFree && isPrivate) || isInactiveTeam;

  const props: RepositoryProps = {
    repository: {
      owner: providerRepository.owner,
      name: providerRepository.name,
      private: providerRepository.private,
      url: repositoryUrl,
    },
    labels: {
      repository: `View branches from repository ${providerRepository.name} by ${providerRepository.owner}`,
      branches: `${branchCount}`,
    },
    selected: selectedIds.includes(repositoryId),
    onClick: () => trackImprovedDashboardEvent('Dashboard - Open Repository'),
    onContextMenu: handleContextMenu,
    isBeingRemoved:
      removingRepository?.owner === providerRepository.owner &&
      removingRepository?.name === providerRepository.name,
    restricted,
  };

  return {
    grid: <RepositoryCard {...props} />,
    list: <RepositoryListItem {...props} />,
  }[viewMode];
};
