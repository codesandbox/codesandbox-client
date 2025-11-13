import React, { useMemo } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { Button, Stack, Text } from '@codesandbox/components';

import { useActions, useAppState } from 'app/overmind';
import {
  RecentlyAccessedSandboxesQuery,
  RecentlyAccessedSandboxesQueryVariables,
  RecentlyAccessedBranchesQuery,
  RecentlyAccessedBranchesQueryVariables,
  RecentlyAccessedSandboxFragmentFragment,
  RecentlyAccessedBranchFragmentFragment,
} from 'app/graphql/types';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';

import {
  RECENTLY_ACCESSED_BRANCHES_QUERY,
  RECENTLY_ACCESSED_SANDBOXES_QUERY,
} from './queries';
import { RecentSandbox } from './RecentSandbox';
import { RecentBranch } from './RecentBranch';

type RecentItem =
  | { type: 'sandbox'; sandbox: RecentlyAccessedSandboxFragmentFragment }
  | { type: 'branch'; branch: RecentlyAccessedBranchFragmentFragment };

export const RecentItems = () => {
  const { activeTeam } = useAppState();
  const { isFrozen } = useWorkspaceLimits();
  const { modalOpened } = useActions();

  const { data: recentlyAccessedSandboxes } = useQuery<
    RecentlyAccessedSandboxesQuery,
    RecentlyAccessedSandboxesQueryVariables
  >(RECENTLY_ACCESSED_SANDBOXES_QUERY, {
    variables: {
      limit: 18, // 18 sandboxes should fit in the grid but do we need that many?
      teamId: activeTeam,
    },
  });

  // TODO skip branch query when sdkuser
  const { data: recentlyAccessedBranches } = useQuery<
    RecentlyAccessedBranchesQuery,
    RecentlyAccessedBranchesQueryVariables
  >(RECENTLY_ACCESSED_BRANCHES_QUERY, {
    variables: {
      limit: 18,
      teamId: activeTeam,
    },
  });

  const sandboxesData =
    recentlyAccessedSandboxes?.me?.recentlyAccessedSandboxes;
  const branchesData = recentlyAccessedBranches?.me?.recentBranches;

  const combinedRecent = useMemo<RecentItem[]>(() => {
    const sandboxes: RecentItem[] =
      sandboxesData?.map(sandbox => ({
        type: 'sandbox' as const,
        sandbox,
      })) || [];

    const branches: RecentItem[] =
      branchesData?.map(branch => ({
        type: 'branch' as const,
        branch,
      })) || [];

    return [...sandboxes, ...branches]
      .sort((a, b) => {
        const dateA =
          a.type === 'sandbox'
            ? a.sandbox.lastAccessedAt
            : a.branch.lastAccessedAt;

        const dateB =
          b.type === 'sandbox'
            ? b.sandbox.lastAccessedAt
            : b.branch.lastAccessedAt;

        return dateB.localeCompare(dateA);
      })
      .slice(0, 18);
  }, [sandboxesData, branchesData]);

  if (combinedRecent.length === 0) {
    return (
      <Stack direction="vertical" align="center" gap={4} padding={8}>
        <Text size={6}>You have no recent work</Text>
        <Stack gap={2}>
          <Button
            onClick={() => {
              modalOpened({ modal: 'create' });
            }}
            disabled={isFrozen}
            variant="secondary"
            autoWidth
          >
            Explore templates
          </Button>
          <Button
            onClick={() => {
              modalOpened({ modal: 'import' });
            }}
            disabled={isFrozen}
            variant="secondary"
            autoWidth
          >
            Import repository
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <div>
      {combinedRecent.map(item =>
        item.type === 'sandbox' ? (
          <RecentSandbox key={item.sandbox.id} sandbox={item.sandbox} />
        ) : (
          <RecentBranch key={item.branch.id} branch={item.branch} />
        )
      )}
    </div>
  );
};
