import React from 'react';
import { useAppState } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { DashboardRepository } from '../../types';
import { RepositoryCard } from './RepositoryCard';
import { RepositoryListItem } from './RepositoryListItem';
import { RepositoryProps } from './types';
import { useSelection } from '../Selection';

export const Repository: React.FC<DashboardRepository> = ({ repository }) => {
  const {
    branchCount,
    repository: providerRepository,
    appInstalled,
  } = repository;
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
    onContextMenu: handleContextMenu,
    isBeingRemoved:
      removingRepository?.owner === providerRepository.owner &&
      removingRepository?.name === providerRepository.name,
    appInstalled,
  };

  return {
    grid: <RepositoryCard {...props} />,
    list: <RepositoryListItem {...props} />,
  }[viewMode];
};
