import * as React from 'react';
import {
  DropTarget,
  ConnectDropTarget,
  DropTargetMonitor,
  DropTargetConnector,
} from 'react-dnd';

import { ITabPosition } from '..';

export interface TabDropZoneProps {
  moveTab: (currentPosition: ITabPosition, nextPosition: ITabPosition) => void;
  index: number;
  devToolIndex: number;
}

interface DragProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
}

const TabDropZone = ({
  connectDropTarget,
  isOver,
}: TabDropZoneProps & DragProps) =>
  connectDropTarget(
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
      }}
    />
  );

const entryTarget = {
  drop: (props: TabDropZoneProps, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    if (sourceItem == null) {
      return;
    }

    const previousPosition: ITabPosition = {
      tabPosition: sourceItem.index,
      devToolIndex: sourceItem.devToolIndex,
    };
    const nextPosition = {
      tabPosition: props.index,
      devToolIndex: props.devToolIndex,
    };

    props.moveTab(previousPosition, nextPosition);
  },

  canDrop: (props: TabDropZoneProps, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return (
      props.index !== source.index || props.devToolIndex !== source.devToolIndex
    );
  },
};

const collectTarget = (
  connectMonitor: DropTargetConnector,
  monitor: DropTargetMonitor
) => {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
};

export default DropTarget('PREVIEW_TAB', entryTarget, collectTarget)(
  TabDropZone
);
