import { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';

type Params = {
  path?: string;
};

export const useFilteredItems = (params: Params) => {
  const param = params.path || '';
  const {
    state: {
      dashboard: {
        getFilteredSandboxes,
        sandboxes,
        filters,
        orderBy: sandboxesOrder,
      },
    },
  } = useOvermind();
  const [items, setItems] = useState<Array<DashboardGridItem>>([]);

  const sandboxesForPath =
    sandboxes.REPOS && param
      ? getFilteredSandboxes(sandboxes.REPOS[param].sandboxes || [])
      : [];
  const repos = (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];
  useEffect(() => {
    if (param) {
      setItems([
        ...sandboxesForPath.map(sandbox => ({
          type: 'sandbox' as 'sandbox',
          sandbox,
        })),
      ]);
    } else {
      setItems([
        ...repos.map(repo => ({
          type: 'repo' as 'repo',
          ...repo,
        })),
      ]);
    }
  }, [
    sandboxes.REPOS,
    param,
    params,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
  ]);

  return items;
};
