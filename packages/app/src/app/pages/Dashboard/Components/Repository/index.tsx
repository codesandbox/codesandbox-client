import React from 'react';
import { useAppState } from 'app/overmind';
import { trackImprovedDashboardEvent } from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { DashboardRepository } from '../../types';
import { RepositoryCard, RepositoryCardSkeleton } from './RepositoryCard';
import {
  RepositoryListItem,
  RepositoryListItemSkeleton,
} from './RepositoryListItem';
import { RepositoryProps } from './types';
import { useSelection } from '../Selection';

export const Repository: React.FC<DashboardRepository> = ({ repository }) => {
  const { branches, repository: providerRepository } = repository;
  const {
    activeTeam,
    dashboard: { viewMode },
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

  const selected = selectedIds.includes(repositoryId);

  const props: RepositoryProps = {
    repository: {
      owner: providerRepository.owner,
      name: providerRepository.name,
      url: repositoryUrl,
    },
    labels: {
      repository: `View branches from repository ${providerRepository.name} by ${providerRepository.owner}`,
      branches: `${branches.length} ${
        branches.length === 1 ? 'branch' : 'branches'
      }`,
    },
    selected,
    onClick: () => trackImprovedDashboardEvent('Dashboard - Open Repository'),
    onContextMenu: handleContextMenu,
  };

  return {
    grid: <RepositoryCard {...props} />,
    list: <RepositoryListItem {...props} />,
  }[viewMode];
};

export const SkeletonRepository: React.FC = () => {
  const { viewMode } = useAppState().dashboard;

  return {
    list: <RepositoryListItemSkeleton />,
    grid: <RepositoryCardSkeleton />,
  }[viewMode];
};
