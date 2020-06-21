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

  const folderSandboxes = (sandboxes.ALL || {})[cleanParam];

  useEffect(() => {
    const sandboxesForPath =
      sandboxes.ALL && sandboxes.ALL[cleanParam]
        ? getFilteredSandboxes(sandboxes.ALL[cleanParam])
        : [];

    const parent = param.split('/').pop();
    const folderFolders =
      allCollections?.filter(
        collection => collection.level === level && collection.parent === parent
      ) || [];

    const sortedFolders = orderBy(folderFolders, 'name').sort(
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
    cleanParam,
    level,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
    folderSandboxes,
  ]);

  return items;
};
