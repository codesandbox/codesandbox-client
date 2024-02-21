import { useState, useEffect } from 'react';
import { compareDesc } from 'date-fns';
import { useAppState } from 'app/overmind';
import { DashboardGridItem } from 'app/pages/Dashboard/types';

type Params = {
  path?: string;
};

export const useFilteredItems = (params: Params) => {
  const param = params.path || '';
  const {
    getFilteredSandboxes,
    sandboxes,
    orderBy: sandboxesOrder,
  } = useAppState().dashboard;
  const [items, setItems] = useState<Array<DashboardGridItem>>([]);
  const sandboxesExist = sandboxes.REPOS && param && sandboxes.REPOS[param];
  const sandboxesForPath = sandboxesExist
    ? getFilteredSandboxes(sandboxes.REPOS[param].sandboxes || [])
    : [];

  const repos = (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  useEffect(() => {
    if (param) {
      setItems(
        sandboxesForPath.map(sandbox => ({
          type: 'sandbox' as 'sandbox',
          noDrag: true,
          sandbox,
        }))
      );
    } else {
      setItems(
        repos
          .sort((a, b) => compareDesc(a.lastEdited, b.lastEdited))
          .map(repo => ({
            type: 'synced-sandbox-repo',
            noDrag: true,
            ...repo,
          }))
      );
    }

    // eslint-disable-next-line
  }, [sandboxes.REPOS, param, params, getFilteredSandboxes, sandboxesOrder]);

  return items;
};
