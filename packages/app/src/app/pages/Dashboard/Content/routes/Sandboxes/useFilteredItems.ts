import { useState, useEffect } from 'react';
import { useAppState } from 'app/overmind';
import { orderBy } from 'lodash-es';
import {
  DashboardSandbox,
  DashboardFolder,
  DashboardTemplate,
  DashboardSkeletonRow,
} from 'app/pages/Dashboard/types';

const skeletonRow = {
  type: 'skeleton-row' as 'skeleton-row',
};

export const useFilteredItems = (
  path: string,
  cleanPath: string,
  level: number
) => {
  const {
    allCollections,
    getFilteredSandboxes,
    sandboxes,
    filters,
    orderBy: sandboxesOrder,
  } = useAppState().dashboard;
  const [items, setItems] = useState<
    Array<
      | DashboardSandbox
      | DashboardTemplate
      | DashboardFolder
      | DashboardSkeletonRow
    >
  >([]);

  const folderSandboxes = (sandboxes.ALL || {})[cleanPath];

  useEffect(() => {
    const sandboxesForPath = getFilteredSandboxes(folderSandboxes || []);
    const parent = path.split('/').pop();
    const folderFolders =
      allCollections?.filter(
        collection => collection.level === level && collection.parent === parent
      ) || [];

    const sortedFolders = orderBy(folderFolders, 'name').sort(a => 1);

    const decoratedFolders = sortedFolders
      .filter(folder => folder.path !== '/')
      .map(folder => ({
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
    cleanPath,
    path,
    level,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
    folderSandboxes,
  ]);

  return items;
};
