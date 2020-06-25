import { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { orderBy } from 'lodash-es';
import {
  DashboardSandbox,
  DashboardFolder,
  DashboardTemplate,
  DashboardSkeletonRow,
} from 'app/pages/NewDashboard/types';

type Params = {
  path?: string;
};

const skeletonRow = {
  type: 'skeleton-row' as 'skeleton-row',
};

export const useFilteredItems = (params: Params, level: number) => {
  const param = params.path || '';
  const cleanParam = param.split(' ').join('{}');
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
    Array<
      | DashboardSandbox
      | DashboardTemplate
      | DashboardFolder
      | DashboardSkeletonRow
    >
  >([]);

  const folderSandboxes = (sandboxes.ALL || {})[cleanParam];

  useEffect(() => {
    const sandboxesForPath = getFilteredSandboxes(folderSandboxes || []);
    const parent = param.split('/').pop();
    const folderFolders =
      allCollections?.filter(
        collection => collection.level === level && collection.parent === parent
      ) || [];

    const sortedFolders = orderBy(folderFolders, 'name').sort(
      a => (a.path === '/drafts' ? -1 : 1) // pull drafts to the top
    );

    const decoratedFolders = sortedFolders.map(folder => ({
      type: 'folder' as 'folder',
      ...folder,
    }));

    const decoratedSandboxes =
      typeof folderSandboxes === 'undefined'
        ? [skeletonRow]
        : sandboxesForPath.map(sandbox => ({
            type: 'sandbox' as 'sandbox',
            sandbox,
          }));

    setItems([...decoratedFolders, ...decoratedSandboxes]);
  }, [
    allCollections,
    cleanParam,
    param,
    level,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
    folderSandboxes,
  ]);

  return items;
};
