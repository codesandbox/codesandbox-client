import { basename, join } from 'path';

import { client } from 'app/graphql/client';

import { RENAME_FOLDER_MUTATION } from './queries';

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

    if (props.readOnly) {
      return false;
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
