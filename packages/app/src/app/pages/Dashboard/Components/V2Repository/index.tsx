import React from 'react';
import { DashboardV2Repository } from '../../types';

export const V2Repository: React.FC<DashboardV2Repository> = ({ repo }) => {
  return <div>{JSON.stringify(repo)}</div>;
};
