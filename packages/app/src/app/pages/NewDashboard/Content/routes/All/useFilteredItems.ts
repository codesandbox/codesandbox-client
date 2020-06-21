import { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { orderBy } from 'lodash-es';
import {
  DashboardSandbox,
  DashboardFolder,
  DashboardTemplate,
} from 'app/pages/NewDashboard/types';

type Params = {
  path?: string;
};

export const useFilteredItems = (params: Params, level: number) => {
  const param = params.path || '';
  const cleanParam = param.split(' ').join('');
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
  const [items, setItems] = useState<
    Array<DashboardSandbox | DashboardTemplate | DashboardFolder>
  >([]);

  useEffect(() => {
    const sandboxesForPath =
      sandboxes.ALL && sandboxes.ALL[cleanParam]
        ? getFilteredSandboxes(sandboxes.ALL[cleanParam])
        : [];

    const unsortedFolders =
      (allCollections &&
        allCollections.filter(
          collection =>
            collection.level === level && collection.parent === param
        )) ||
      [];
    const sortedFolders = orderBy(unsortedFolders, 'name').sort(
      a => (a.path === '/drafts' ? -1 : 1) // pull drafts to the top
    );
    setItems([
      ...sortedFolders.map(folder => ({
        type: 'folder' as 'folder',
        ...folder,
      })),
      ...sandboxesForPath.map(sandbox => ({
        type: 'sandbox' as 'sandbox',
        sandbox,
      })),
    ]);
  }, [
    allCollections,
    level,
    param,
    filters.blacklistedTemplates,
    sandboxesOrder,
    sandboxes.ALL,
    cleanParam,
    getFilteredSandboxes,
  ]);

  return items;
};
