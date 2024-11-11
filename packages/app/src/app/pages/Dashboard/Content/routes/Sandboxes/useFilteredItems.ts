import { useState, useEffect } from 'react';
import { useAppState } from 'app/overmind';
import { orderBy } from 'lodash-es';
import {
  DashboardSandbox,
  DashboardFolder,
  DashboardTemplate,
  DashboardSkeletonRow,
} from 'app/pages/Dashboard/types';

import { getParentPath, normalizePath } from '../../../utils/path';

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
    const normalizedPath = normalizePath(path);

    const folderFolders =
      allCollections?.filter(
        collection =>
          normalizePath(getParentPath(collection.path)) === normalizedPath
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
    getFilteredSandboxes,
    sandboxesOrder,
    folderSandboxes,
  ]);

  return items;
};
