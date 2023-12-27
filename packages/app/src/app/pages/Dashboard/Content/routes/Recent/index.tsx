import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Helmet } from 'react-helmet';
import { DashboardBranch, DashboardSandbox } from 'app/pages/Dashboard/types';
import { Loading, Stack } from '@codesandbox/components';
import { EmptyRecent } from './EmptyRecent';
import { RecentContent } from './RecentContent';

export const Recent = props => {
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  useEffect(() => {
    getPage(sandboxesTypes.RECENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const items: (DashboardSandbox | DashboardBranch)[] =
    sandboxes.RECENT_BRANCHES === null || sandboxes.RECENT_SANDBOXES === null
      ? null
      : [
          ...(sandboxes.RECENT_SANDBOXES || []).map(sandbox => ({
            type: 'sandbox' as const,
            sandbox,
          })),
          ...(sandboxes.RECENT_BRANCHES || []).map(branch => ({
            type: 'branch' as const,
            branch,
          })),
        ].sort((a, b) => {
          const dateA =
            a.type === 'branch'
              ? a.branch.lastAccessedAt
              : a.sandbox.lastAccessedAt;
          const dateB =
            b.type === 'branch'
              ? b.branch.lastAccessedAt
              : b.sandbox.lastAccessedAt;

          return new Date(dateA) < new Date(dateB) ? 1 : -1;
        });

  let pageState: 'loading' | 'ready' | 'empty';
  if (!items) {
    pageState = 'loading';
  } else if (items.length > 0) {
    pageState = 'ready';
  } else {
    pageState = 'empty';
  }

  return (
    <>
      <Helmet>
        <title>Recent - CodeSandbox</title>
      </Helmet>
      {pageState === 'loading' && (
        <Stack align="center" justify="center">
          <Loading size={12} />
        </Stack>
      )}
      {pageState === 'empty' && <EmptyRecent />}
      {pageState === 'ready' && <RecentContent recentItems={items} />}
    </>
  );
};
