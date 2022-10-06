import {
  ProjectFragment,
  SidebarCollectionDashboardFragment as Collection,
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

export function sortByNameAscending(
  a: ProjectFragment,
  b: ProjectFragment
): number {
  const repoA = a.repository.owner + '/' + a.repository.name;
  const repoB = b.repository.owner + '/' + b.repository.name;
  return repoA < repoB ? -1 : 1;
}
