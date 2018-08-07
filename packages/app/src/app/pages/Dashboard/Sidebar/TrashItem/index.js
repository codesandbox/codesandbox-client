import React from 'react';
import { DropTarget } from 'react-dnd';
import TrashIcon from 'react-icons/lib/md/delete';

import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Item from '../Item';

const TrashItem = ({ isOver, canDrop, connectDropTarget }) =>
  connectDropTarget(
    <div>
      <Item
        path={'/dashboard/trash'}
        Icon={TrashIcon}
        name="Trash"
        style={
          isOver && canDrop ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' } : {}
        }
      />
    </div>
  );

export const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return {};

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return {};

    return { delete: true };
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return !props.removedAt;
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

export default inject('store', 'signals')(
  DropTarget(['SANDBOX'], entryTarget, collectTarget)(
    withRouter(observer(TrashItem))
  )
);
