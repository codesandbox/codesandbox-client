import { client } from 'app/graphql/client';
import { join, basename } from 'path';

import {
  ADD_SANDBOXES_TO_FOLDER_MUTATION,
  RENAME_FOLDER_MUTATION,
  PATHED_SANDBOXES_CONTENT_QUERY,
} from '../../queries';

function addSandboxesToCollection(props, item) {
  const { path, teamId, store } = props;

  const selectedSandboxes = store.dashboard.selectedSandboxes;

  client.mutate({
    mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
    variables: {
      collectionPath: path || '/',
      teamId,
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

    refetchQueries: ['DeletedSandboxes'],

    update: (cache, { data: { addToCollection } }) => {
      // Update new folder
      try {
        const usedPath = path || '/';
        const variables = { path: usedPath };

        if (teamId) {
          variables.teamId = teamId;
        }

        const cacheData = cache.readQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables,
        });

        cacheData.me.collection.sandboxes = addToCollection.sandboxes;

        cache.writeQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables,
          data: cacheData,
        });
      } catch (e) {
        // Means that the cache didn't exist yet, no biggie
      }

      if (!item.removedAt) {
        // Update old folders
        const collectionPath = item.collectionPath;

        const variables = { path: collectionPath };

        if (item.collectionTeamId) {
          variables.teamId = item.collectionTeamId;
        }

        const oldFolderCacheData = cache.readQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables,
        });

        oldFolderCacheData.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
          x => selectedSandboxes.indexOf(x.id) === -1
        );

        cache.writeQuery({
          query: PATHED_SANDBOXES_CONTENT_QUERY,
          variables,
          data: oldFolderCacheData,
        });
      }
    },
  });
}

function addFolderToFolder(props, item) {
  const newPath = join(props.path || '/', basename(item.path));
  client.mutate({
    mutation: RENAME_FOLDER_MUTATION,
    refetchQueries: ['PathedSandboxesFolders'],
    variables: {
      path: item.path,
      newPath,
      teamId: item.teamId,
      newTeamId: props.teamId,
    },
  });
}

export const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return;

    const type = monitor.getItemType();
    const item = monitor.getItem();

    if (item && type) {
      switch (type) {
        case 'SANDBOX': {
          addSandboxesToCollection(props, item);
          break;
        }
        case 'FOLDER': {
          addFolderToFolder(props, item);
          break;
        }

        default:
          break;
      }
    }
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    const type = monitor.getItemType();

    if (type === 'SANDBOX') {
      if (
        !source.removedAt &&
        source.collectionPath === (props.path || '/') &&
        // Double check because we may compare null to undefined
        // eslint-disable-next-line eqeqeq
        source.collectionTeamId == props.teamId
      ) {
        return false;
      }
      return true;
    }
    return source.path !== props.path;
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
