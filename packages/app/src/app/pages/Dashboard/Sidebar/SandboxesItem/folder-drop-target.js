import { client } from 'app/graphql/client';

import {
  ADD_SANDBOXES_TO_FOLDER_MUTATION,
  PATHED_SANDBOXES_CONTENT_QUERY,
} from '../../queries';

export const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return;

    const { id, path, store } = props;

    const item = monitor.getItem();
    const selectedSandboxes = store.dashboard.selectedSandboxes;

    client.mutate({
      mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
      variables: {
        collectionId: id,
        sandboxIds: selectedSandboxes.toJS(),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addToCollection: {
          __typename: 'Collection',
          // We keep this empty, because it will be loaded later regardless. We
          // just want the main directory to update immediately
          sandboxes: [],
        },
      },

      update: (cache, { data: { addToCollection } }) => {
        // Update new folder
        try {
          const usedPath = path || '/';
          const cacheData = cache.readQuery({
            query: PATHED_SANDBOXES_CONTENT_QUERY,
            variables: { path: usedPath },
          });

          cacheData.me.collection.sandboxes = addToCollection.sandboxes;

          cache.writeQuery({
            query: PATHED_SANDBOXES_CONTENT_QUERY,
            variables: { path: usedPath },
            data: cacheData,
          });
        } catch (e) {
          console.error(e);
          // Means that the cache didn't exist yet, no biggie
        }

        // Update old folders
        const collectionPath = item.collectionPath;

        const oldFolderCacheData = cache.readQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables: { path: collectionPath },
        });

        oldFolderCacheData.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
          x => selectedSandboxes.indexOf(x.id) === -1
        );

        cache.writeQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables: { path: collectionPath },
          data: oldFolderCacheData,
        });
      },
    });
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.collectionPath === (props.path || '/')) {
      return false;
    }
    return true;
  },
};

export function collectTarget(connectMonitor, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}
