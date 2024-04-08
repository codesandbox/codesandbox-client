import {
  BranchFragment,
  ProjectFragment,
  SidebarCollectionDashboardFragment as Collection,
  BranchWithPrFragment,
} from 'app/graphql/types';
import { DELETE_ME_COLLECTION } from './types';

export function getDecoratedCollection(
  collection: Collection
): DELETE_ME_COLLECTION {
  const split = collection.path.split('/');
  return {
    path: collection.path,
    id: collection.id,
    sandboxCount: collection.sandboxCount,
    parent: split[split.length - 2] || '',
    level: split.length - 2,
    name: split[split.length - 1],
  };
}

export function sortByLastAccessed(
  a: ProjectFragment | BranchFragment | BranchWithPrFragment,
  b: ProjectFragment | BranchFragment | BranchWithPrFragment
): number {
  if (!a.lastAccessedAt || !b.lastAccessedAt) {
    return 1;
  }

  return new Date(a.lastAccessedAt) < new Date(b.lastAccessedAt) ? 1 : -1;
}

export function getProjectUniqueKey({
  teamId,
  owner,
  name,
}: {
  teamId: string;
  owner: string;
  name: string;
}): string {
  return `${teamId}/${owner}/${name}`;
}
