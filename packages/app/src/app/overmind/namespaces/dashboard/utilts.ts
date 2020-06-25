import { SidebarCollectionDashboardFragment as Collection } from 'app/graphql/types';
import { DELETE_ME_COLLECTION } from './state';

export const isRepoPage = location.pathname.includes('/repositories');

export function getDecoratedCollection(
  collection: Collection,
  sandboxCount = 0
): DELETE_ME_COLLECTION {
  const split = collection.path.split('/');
  return {
    path: collection.path,
    id: collection.id,
    sandboxes: sandboxCount,
    parent: split[split.length - 2] || '',
    level: split.length - 2,
    name: split[split.length - 1],
  };
}
