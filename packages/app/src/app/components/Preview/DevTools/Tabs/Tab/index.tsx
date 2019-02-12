import * as React from 'react';
import {
  DragSource,
  ConnectDragSource,
  DropTarget,
  ConnectDropTarget,
  DropTargetMonitor,
  DropTargetConnector,
} from 'react-dnd';
import CrossIcon from 'react-icons/lib/md/clear';

import { Tab, CloseTab } from './elements';
import { IViewType } from '../..';
import { ITabPosition } from '..';

export interface TabProps {
  active: boolean;
  pane: IViewType;
  onClick: (e: Event) => void;
  onMouseDown: (e: Event) => void;
  moveTab: (currentPosition: ITabPosition, nextPosition: ITabPosition) => void;
  index: number;
  devToolIndex: number;
  canDrag: boolean;
}

interface DragProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isDragging: boolean;
  isOver: boolean;
}

export const PaneTab = ({
  active,
  pane,
  onClick,
  onMouseDown,
  connectDragSource,
  connectDropTarget,
  isOver,
  isDragging,
}: TabProps & DragProps) => {
  const component = (
    <div
      style={{
        height: '100%',
        backgroundColor:
          isOver && !isDragging ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
      }}
    >
      <Tab
        active={active}
        onClick={onClick}
        onMouseDown={onMouseDown}
        key={pane.id}
      >
        {pane.title}
        {false &&
        active && ( // This will be enabled later on
            <CloseTab>
              <CrossIcon />
            </CloseTab>
          )}
      </Tab>
    </div>
  );

  if (connectDragSource) {
    return connectDropTarget(connectDragSource(component));
  }

  return component;
};

const entryTarget = {
  drop: (props: TabProps, monitor) => {
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

  canDrop: (props: TabProps, monitor) => {
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

const entrySource = {
  canDrag: (props: TabProps) => props.canDrag,
  beginDrag: (props: TabProps) => ({
    index: props.index,
    devToolIndex: props.devToolIndex,
  }),
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('PREVIEW_TAB', entryTarget, collectTarget)(
  DragSource('PREVIEW_TAB', entrySource, collectSource)(PaneTab)
);
