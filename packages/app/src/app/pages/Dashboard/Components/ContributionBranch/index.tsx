import React from 'react';
import { DashboardContributionBranch } from '../../types';

export const ContributionBranch: React.FC<DashboardContributionBranch> = ({
  branch,
}) => {
  return <>{JSON.stringify(branch)}</>;
};
