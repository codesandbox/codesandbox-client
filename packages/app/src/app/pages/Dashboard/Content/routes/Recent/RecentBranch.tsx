import React from 'react';

import { RecentlyAccessedBranchFragmentFragment } from 'app/graphql/types';

interface RecentBranchProps {
  branch: RecentlyAccessedBranchFragmentFragment;
}

export const RecentBranch = ({ branch }: RecentBranchProps) => {
  return (
    <div>
      <div>{branch.name}</div>
      <div>{branch.lastAccessedAt}</div>
    </div>
  );
};