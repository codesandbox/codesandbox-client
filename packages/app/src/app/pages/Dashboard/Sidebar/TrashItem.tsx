import React, { FunctionComponent } from 'react';
import {
  DropTarget,
  DropTargetCollector,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';
import TrashIcon from 'react-icons/lib/md/delete';

import { DELETE_SANDBOX_DROP_KEY } from '../Content/SandboxCard';

import { Item } from './Item';

type OwnProps = {
  currentPath: string;
};
type Props = OwnProps & CollectedProps;
const TrashItemComponent: FunctionComponent<Props> = ({
  canDrop,
  connectDropTarget,
  currentPath,
  isOver,
}) =>
  connectDropTarget(
    <div>
      <Item
        active={currentPath === '/dashboard/trash'}
        Icon={TrashIcon}
        name="Trash"
        path="/dashboard/trash"
        style={
          canDrop && isOver
            ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
            : undefined
        }
      />
    </div>
  );

const entryTarget: DropTargetSpec<OwnProps> = {
  canDrop: (_props, monitor) => monitor.getItem() !== null,
  drop: (_props, monitor) => {
    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) {
      return {};
    }

    // Used in SandboxCard
    return {
      [DELETE_SANDBOX_DROP_KEY]: true,
    };
  },
};

const collectTarget: DropTargetCollector<CollectedProps, unknown> = (
  connect,
  monitor
) => ({
  canDrop: monitor.canDrop(),
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver({ shallow: true }),
});

type CollectedProps = {
  canDrop: ReturnType<DropTargetMonitor['canDrop']>;
  connectDropTarget: ReturnType<DropTargetConnector['dropTarget']>;
  isOver: ReturnType<DropTargetMonitor['isOver']>;
};
export const TrashItem = DropTarget<OwnProps, CollectedProps>(
  ['SANDBOX'],
  entryTarget,
  collectTarget
)(TrashItemComponent);
