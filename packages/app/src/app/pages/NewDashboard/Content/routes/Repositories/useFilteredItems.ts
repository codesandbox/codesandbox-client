import { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { orderBy } from 'lodash-es';
import {
  DashboardSandbox,
  DashboardRepo,
  DashboardTemplate,
} from 'app/pages/NewDashboard/types';

type Params = {
  path?: string;
};

export const useFilteredItems = (params: Params) => {
  const param = params.path || '';
  const {
    state: {
      dashboard: {
        allCollections,
        getFilteredSandboxes,
        sandboxes,
        filters,
        orderBy: sandboxesOrder,
      },
    },
  } = useOvermind();
  const [items, setItems] = useState<Array<DashboardSandbox | DashboardRepo>>(
    []
  );

  const folderSandboxes = sandboxes.REPOS || [];

  useEffect(() => {
    setItems([
      ...folderSandboxes.map(folder => ({
        type: 'repo' as 'repo',
        ...folder,
      })),
      // ...sandboxesForPath.map(sandbox => ({
      //   type: 'sandbox' as 'sandbox',
      //   sandbox,
      // })),
    ]);
  }, [
    allCollections,
    param,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
    folderSandboxes,
  ]);

  return items;
};
