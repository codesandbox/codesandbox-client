import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Icon } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { DashboardBranch } from '../../types';
import { BranchCard } from './BranchCard';
import { BranchListItem } from './BranchListItem';

const BranchIcon = (
  <Icon aria-hidden color="#EDFFA5" name="contribution" size={16} />
);

export const Branch: React.FC<DashboardBranch> = ({ branch }) => {
  const {
    dashboard: { viewMode },
  } = useAppState();
  const history = useHistory();
  const { name, project } = branch;
  const { repository } = project;

  const url = v2BranchUrl({ name, project });

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // TODO: add analytics
    if (e.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  const props = {
    branchName: name,
    repository,
    BranchIcon,
    onClick: handleClick,
  };

  return {
    grid: <BranchCard {...props} />,
    list: <BranchListItem {...props} />,
  }[viewMode];
};
