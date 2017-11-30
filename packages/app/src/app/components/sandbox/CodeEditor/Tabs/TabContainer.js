// @flow
import React from 'react';

import type { Module } from 'common/types';

import { DragSource, DropTarget } from 'react-dnd';

import Tab from './Tab';

type Props = {
  module: Module,
  active: boolean,
  setCurrentModule: (moduleId: string) => void,
  closeTab: (position: number) => void,
  moveTab: (oldPosition: number, position: number) => void, // eslint-disable-line react/no-unused-prop-types
  markNotDirty: () => void,
  tabCount: number,

  // Injected by React DnD:
  isDragging: boolean,
  isOver: boolean,
  connectDragSource: Function,
  connectDropTarget: Function,

  position: number,
  dirty: boolean,
  dirName: ?string,

  innerRef: ?Function,
};

class TabContainer extends React.PureComponent<Props> {
  setCurrentModule = () => {
    this.props.setCurrentModule(this.props.module.id);
  };

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isOver,
      module,
      active,
      tabCount,
      isDragging,
      dirty,
      dirName,
      position,
      closeTab,
      innerRef,
    } = this.props;

    return connectDropTarget(
      connectDragSource(
        <span ref={innerRef} style={{ opacity: isDragging ? 0.8 : 1 }}>
          <Tab
            active={active}
            dirty={dirty}
            isOver={isOver}
            module={module}
            dirName={dirName}
            tabCount={tabCount}
            position={position}
            closeTab={closeTab}
            onClick={this.setCurrentModule}
            onDoubleClick={this.props.markNotDirty}
          />
        </span>
      )
    );
  }
}

const entryTarget = {
  drop: (props: Props, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    if (sourceItem == null) {
      return;
    }

    props.moveTab(sourceItem.position, props.position);
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return props.position !== source.position;
  },
};

function collectTarget(connectMonitor, monitor) {
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

const entrySource = {
  canDrag: () => true,
  beginDrag: (props: Props) => ({ position: props.position }),
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('TAB', entryTarget, collectTarget)(
  DragSource('TAB', entrySource, collectSource)(TabContainer)
);
